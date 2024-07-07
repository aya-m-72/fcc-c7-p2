'use strict';
const Project = require('../models').Project
const Issue = require("../models").Issue


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res)=>{
      let project = req.params.project;
      try{
        const projectResult = await Project.findOne({name:project})
        if (!projectResult){
          res.json([])
        }else{
          const issues = await Issue.find({projectId:projectResult._id,...req.query}).select({projectId:0,__v:0})
          if(!issues){
            res.json([])
          }else{
            res.json(issues)
          }
        }
      
      }catch(err){
        console.log(err)
        res.json([])
      }
      
    })
    
    .post(async (req, res)=>{
      let project = req.params.project;
      try {
        // if project exists get the id, if not create new one
        let projectResult = await Project.findOne({name:project})
        if(!projectResult){
          projectResult = new Project({name:project})
          await projectResult.save()
        }
        const projectId = projectResult._id
        const issue_title = req.body.issue_title
        const issue_text = req.body.issue_text
        const created_by = req.body.created_by
        const assigned_to = req.body.assigned_to || ""
        const status_text = req.body.status_text || ""
        // now create new issue only if required fields are present
        if(issue_title&&issue_text&&created_by){
          const newIssue = new Issue({
            projectId,
            issue_title ,
            issue_text ,
            created_by ,
            assigned_to,
            status_text,
            created_on: new Date(),
            updated_on:new Date(),
          })
          await newIssue.save()
          res.json({
            assigned_to:newIssue.assigned_to ,
            status_text:newIssue.status_text ,
            open:newIssue.open,
            _id:newIssue._id,
            issue_title:newIssue.issue_title,
            issue_text:newIssue.issue_text,
            created_by:newIssue.created_by,
            created_on: newIssue.created_on,
            updated_on: newIssue.updated_on,
          })
        }else{
          res.json({ error: "required field(s) missing" })
        }
      } catch (err) {
        console.log(err)
      }
      
    })
    
    .put(async (req, res)=>{
      let project = req.params.project;
      const _id = req.body._id
      if (!_id){
        res.json({ error: "missing _id" })
        return;
      }
      const issue_title = req.body.issue_title
      const issue_text = req.body.issue_text
      const created_by = req.body.created_by
      const assigned_to = req.body.assigned_to
      const status_text = req.body.status_text
      const open = req.body.open

      if(!issue_title&&!issue_text&&!created_by&&!assigned_to&&!status_text&&!open){
        res.json({ error: "no update field(s) sent",  _id })
        return;
      }
      const updatedIssue = {}
      for(const prop in req.body){
        if (prop === 'open' && req.body[prop] == 'false'){
          updatedIssue.open = false
        }else if(prop !='_id' && req.body[prop]){
          updatedIssue[prop] = req.body[prop]
        }
      }
      updatedIssue.updated_on = new Date()

      try {
        const projectResult = await Project.findOne({name:project})
        if(!projectResult){
          res.json({'error':'could not find project'})
          return;
        }
        const issue = await Issue.findOneAndUpdate({_id,projectId:projectResult._id},updatedIssue)
        if (!issue){
          res.json({ error: "could not update", _id })
        }else{
          res.json({  result: 'successfully updated', _id })
        }
        
      } catch (err) {
        console.log(err)
        res.json({ error: "could not update", _id})
        
      }
      
    })
    
    .delete(async (req, res)=>{
      let project = req.params.project;
      const _id = req.body._id
      if(!_id){
        res.json({ error: "missing _id" })
        return
      }
      try {
        const projectResult = await Project.findOne({name:project})
        if(!projectResult){
          res.json({'error':'could not find project'})
          return;
        }
        const issue = await Issue.findOneAndDelete({_id,projectId:projectResult._id})
        if(!issue){
          res.json({ error: "could not delete", _id })
          return
        }
        res.json({ result: "successfully deleted",  _id })
        
      } catch (err) {
        console.log(err)
        res.json({ error: "could not delete", _id })
      }
    });
    
};
