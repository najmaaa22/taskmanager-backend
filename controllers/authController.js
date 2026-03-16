const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// REGISTER USER
exports.registerUser = async (req, res) => {

 try {

  const { name, email, password } = req.body

  // check fields
  if (!name || !email || !password) {
   return res.status(400).json({
    message: "All fields required"
   })
  }

  // check user exists
  const existingUser = await User.findOne({ email })

  if (existingUser) {
   return res.status(400).json({
    message: "User already exists"
   })
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // create user
  const user = await User.create({
   name,
   email,
   password: hashedPassword,
   role: "user"
  })

  res.status(201).json({
   message: "User Registered Successfully",
   user: {
    id: user._id,
    name: user.name,
    email: user.email
   }
  })

 } catch (error) {

  res.status(500).json({
   message: "Server Error",
   error: error.message
  })

 }

}


// LOGIN USER
exports.loginUser = async (req, res) => {

 try {

  const { email, password } = req.body

  if (!email || !password) {
   return res.status(400).json({
    message: "Email and Password required"
   })
  }

  const user = await User.findOne({ email })

  if (!user) {
   return res.status(400).json({
    message: "User not found"
   })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
   return res.status(400).json({
    message: "Invalid password"
   })
  }

  const token = jwt.sign(
   {
    userId: user._id,
    role: user.role
   },
   process.env.JWT_SECRET,
   { expiresIn: "1d" }
  )

  res.json({
   message: "Login Successful",
   token,
   user: {
    id: user._id,
    name: user.name,
    email: user.email
   }
  })

 } catch (error) {

  res.status(500).json({
   message: "Server Error",
   error: error.message
  })

 }

}