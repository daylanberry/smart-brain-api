const jwt = require('jsonwebtoken')
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URI);


const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission')
  }

  return new Promise((resolve, reject) => {
    db.select('email', 'hash').from('login')
      .where('email', '=', email)
      .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
              resolve(user[0])
            })
            .catch(err => reject('unable to get user'))
        } else {
          reject('Wrong credentials')
        }
      })
      .catch(err => reject('error'))
  })
}

const getAuthTokenId = (req, res) => {
  const  { authorization } = req.headers

  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized')
    } else {
      return res.json({id: reply})
    }
  })
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload,  'jwt-secret', { expiresIn: '2 days'})

}

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
  const { email, id } = user;
  const token = signToken(email)

  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token }
    })
    .catch(err => console.log('err', err))

}

const signinAuthentication = (db, bcrypt) => (req, res) => {

  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res) :
    handleSignin(db, bcrypt, req, res)
      .then(data => {
        if (data.id && data.email) {
          return createSessions(data)
        } else {
          Promise.reject(data)
        }
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err))
}

module.exports = {
  signinAuthentication: signinAuthentication,
  redisClient: redisClient
}