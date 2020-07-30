const redisClient = require('./signin').redisClient

const userSignout = (req, res) => {
  const { authorization } = req.headers


  redisClient.del(authorization, (err, response) => {
    if (err || response) {
      res.json('Cannot delete')
    } else {
      res.json('Successfully deleted')
    }
  })
}

module.exports = userSignout