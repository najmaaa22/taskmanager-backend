const Task = require("../models/Task")

// GET TASKS (Pagination + Role Filter)
exports.getTasks = async(req,res)=>{

 try{

 const page = Number(req.query.page) || 1
 const limit = Number(req.query.limit) || 10
 const skip = (page-1) * limit

 let query = {}

 // If not admin, only show user's tasks
 if(req.user.role !== "admin"){
  query.createdBy = req.user.userId
 }

 const tasks = await Task.find(query)
 .skip(skip)
 .limit(limit)
 .sort({createdAt:-1})

 const total = await Task.countDocuments(query)

 res.json({
  data:tasks,
  page,
  totalPages:Math.ceil(total/limit),
  totalTasks:total
 })

 }catch(err){
  res.status(500).json({msg:"Server Error"})
 }

}


// CREATE TASK
exports.createTask = async(req,res)=>{

 try{

 const task = await Task.create({
  title:req.body.title,
  description:req.body.description,
  status:req.body.status || "todo",
  createdBy:req.user.userId
 })

 res.json(task)

 }catch(err){
  res.status(500).json({msg:"Server Error"})
 }

}


// UPDATE TASK
exports.updateTask = async(req,res)=>{

 try{

 const task = await Task.findById(req.params.id)

 if(!task){
  return res.status(404).json({msg:"Task not found"})
 }

 // User can only edit their task
 if(req.user.role !== "admin" && task.createdBy.toString() !== req.user.userId){
  return res.status(403).json({msg:"Forbidden"})
 }

 const updated = await Task.findByIdAndUpdate(
  req.params.id,
  req.body,
  {new:true}
 )

 res.json(updated)

 }catch(err){
  res.status(500).json({msg:"Server Error"})
 }

}


// DELETE TASK
exports.deleteTask = async(req,res)=>{

 try{

 const task = await Task.findById(req.params.id)

 if(!task){
  return res.status(404).json({msg:"Task not found"})
 }

 if(req.user.role !== "admin" && task.createdBy.toString() !== req.user.userId){
  return res.status(403).json({msg:"Forbidden"})
 }

 await Task.findByIdAndDelete(req.params.id)

 res.json({msg:"Task Deleted"})

 }catch(err){
  res.status(500).json({msg:"Server Error"})
 }

}