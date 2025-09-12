const express = require('express');
const router = express.Router();
const Task = require('./taskModel');

// CREATE
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).send(task);
});

// READ
router.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

// UPDATE
router.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(task);
});

// DELETE
router.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: "Tarefa deletada" });
});

// EXPORT JSON
router.get('/export', async (req, res) => {
  const tasks = await Task.find();
  res.setHeader('Content-disposition', 'attachment; filename=tasks.json');
  res.setHeader('Content-type', 'application/json');
  res.send(JSON.stringify(tasks, null, 2));
});

module.exports = router;
