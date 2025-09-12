const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['alta', 'média', 'baixa'],
    default: 'média'
  }
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

// Criando um índice para buscas mais rápidas ordenadas por data de criação
taskSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);