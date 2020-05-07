const express = require("express");
const Task = require("../models/task");
const auth = require("../middlewares/auth");

const task = express.Router();

task.post("/tasks", auth, async (req, res) => {
  // const task = new Task( req.body );

  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

task.get("/tasks", auth, async (req, res) => {
  const { completed, limit, skip, sortBy } = req.query;
  const match = {};
  const sort = {};
  if ( completed ) {
    match.completed = req.query.completed == 'true'
  }

  if ( sortBy ) {
    const compareCondition = sortBy.split(':')[1];
    sort.completed = compareCondition === 'desc' ? -1 : 1;
  }
  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt( limit ),
        skip: parseInt( skip ),
        sort
      }
    }).execPopulate();
    console.log( req.user.tasks );
    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});

task.get("/tasks/:id", auth, async (req, res) => {
  // const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!tasks) return status(404).send();
    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update user by ID

task.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  const updates = Object.keys(req.body);
  const validUpdates = ["title", "description"];
  const isValidUpdate = updates.every(update => validUpdates.includes(update));

  if (!isValidUpdate) {
    res.status(400).send({ error: "Invalid update" });
  }

  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
        res.status(404).send();
      }
    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

task.delete("/tasks/:id", auth, async( req, res ) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            res.status(404).send()
        }
        res.send(task);
    } catch( e ) {
        res.status(400).send(e)
    } 
})

module.exports = task;
