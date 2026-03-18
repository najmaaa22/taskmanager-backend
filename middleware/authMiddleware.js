const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {

 // ✅ Get token from cookie instead of header
 const token = req.cookies.token

 if (!token) {
  return res.status(401).json({ msg: "No Token" })
 }

 try {

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  req.user = decoded

  next()

 } catch (err) {

  return res.status(401).json({ msg: "Invalid Token" })

 }

}