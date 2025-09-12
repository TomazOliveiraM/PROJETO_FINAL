const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Obtém o perfil e as estatísticas do usuário logado
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Busca o usuário e as estatísticas em paralelo para mais eficiência
    const [user, totalTasks, completedTasks, priorityStats] = await Promise.all([
      User.findById(userId).select('-password'), // Busca o usuário, excluindo a senha
      Task.countDocuments({ user: userId }), // Conta o total de tarefas
      Task.countDocuments({ user: userId, completed: true }), // Conta as tarefas completas
      Task.aggregate([ // Agrega para contar tarefas por prioridade
        { $match: { user: userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
    ]);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Formata as estatísticas de prioridade em um objeto mais fácil de usar
    const priorities = priorityStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, { alta: 0, média: 0, baixa: 0 });

    res.json({
      username: user.username,
      memberSince: user.createdAt,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        priorities
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;