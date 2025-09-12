const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/tasks
// @desc    Obter todas as tarefas do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { sortBy, search } = req.query; // e.g., 'priority' or 'date', and a search term

    // Query base para buscar apenas tarefas do usuário logado
    const matchQuery = { user: userId };

    // Adiciona o filtro de busca se ele for fornecido
    if (search) {
      matchQuery.title = { $regex: search, $options: 'i' }; // 'i' para case-insensitive
    }

    let tasks;

    if (sortBy === 'priority') {
      // Se ordenar por prioridade, usa o pipeline de agregação
      tasks = await Task.aggregate([
        { $match: matchQuery },
        {
          $addFields: {
            priorityOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ['$priority', 'alta'] }, then: 1 },
                  { case: { $eq: ['$priority', 'média'] }, then: 2 },
                  { case: { $eq: ['$priority', 'baixa'] }, then: 3 },
                ],
                default: 4,
              },
            },
          },
        },
        { $sort: { priorityOrder: 1, createdAt: -1 } },
      ]);
    } else {
      // Ordenação padrão por data, usando a query de busca
      tasks = await Task.find(matchQuery).sort({ createdAt: -1 }).lean();
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/tasks
// @desc    Adicionar uma nova tarefa
router.post('/', authMiddleware, async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    user: req.user.id
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    // Tratamento de erro mais específico para validação do Mongoose
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Erro de validação', errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Marcar uma tarefa como completa/incompleta
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    // Esta abordagem combina a verificação de autorização e a atualização em uma única operação atômica,
    // usando um pipeline de agregação para inverter o valor booleano. É mais seguro e eficiente.
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      [{ $set: { completed: { $not: '$completed' } } }],
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não autorizada.' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PATCH /api/tasks/:id
// @desc    Editar o conteúdo de uma tarefa (título/descrição)
router.patch('/:id', authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  // Garante que pelo menos um título seja enviado
  if (!title) {
    return res.status(400).json({ message: 'O título é obrigatório.' });
  }

  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: userId }, // Garante que o usuário só possa editar suas próprias tarefas
      { $set: { title, description } },
      { new: true } // Retorna o documento atualizado
    );

    if (!updatedTask) return res.status(404).json({ message: 'Tarefa não encontrada ou não autorizada.' });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Excluir uma tarefa
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não autorizada.' });
    }
    res.json({ message: 'Tarefa excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;