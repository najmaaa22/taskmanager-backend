const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")

dotenv.config()

connectDB()

const app = express()

app.use(cors({
  origin: "https://najmataskmanager.vercel.app",
  credentials: true
}));
app.use(express.json())


app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT}`)
})