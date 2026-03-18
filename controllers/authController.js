const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// REGISTER USER (no change needed)
exports.registerUser = async (req, res) => {

 try {

  const { name, email, password } = req.body

  if (!name || !email || !password) {
   return res.status(400).json({ message: "All fields required" })
  }

  const existingUser = await User.findOne({ email })

  if (existingUser) {
   return res.status(400).json({ message: "User already exists" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
   name,
   email,
   password: hashedPassword,
   role: "user"
  })

  res.status(201).json({
   message: "User Registered Successfully"
  })

 } catch (error) {

  res.status(500).json({
   message: "Server Error",
   error: error.message
  })

 }

}


// LOGIN USER (UPDATED TO COOKIE)
exports.loginUser = async (req, res) => {

 try {

  const { email, password } = req.body

  if (!email || !password) {
   return res.status(400).json({ message: "Email and Password required" })
  }

  const user = await User.findOne({ email })

  if (!user) {
   return res.status(400).json({ message: "User not found" })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
   return res.status(400).json({ message: "Invalid password" })
  }

  const token = jwt.sign(
   {
    userId: user._id,
    role: user.role
   },
   process.env.JWT_SECRET,
   { expiresIn: "1d" }
  )

  // ✅ STORE TOKEN IN HTTP-ONLY COOKIE
  res.cookie("token", token, {
   httpOnly: true,
   secure: false, // true in production
   sameSite: "lax"
  })

  res.json({
   message: "Login Successful"
  })

 } catch (error) {

  res.status(500).json({
   message: "Server Error",
   error: error.message
  })

 }

}


// LOGOUT USER (NEW)
exports.logoutUser = (req, res) => {

 res.clearCookie("token")

 res.json({
  message: "Logged out successfully"
 })

}