const mongoose = require("mongoose")
const { Schema } = mongoose

const issueSchema = new Schema({
  projectId: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: String,
  open: {type:Boolean, default:true},
  status_text:String,
  created_on: Date,
  updated_on: Date,
})
const Issue = mongoose.model("Issue", issueSchema)

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
})
const Project = mongoose.model("Project", projectSchema)

exports.Issue = Issue
exports.Project = Project
