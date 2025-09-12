const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite requisições de origens diferentes (do nosso frontend)
app.use(express.json()); // Para parsear JSON no corpo das requisições
app.use(express.static(path.join(__dirname, '../frontend'))); // Servir arquivos estáticos

// Verificação da variável de ambiente antes de conectar
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('ERRO: Variáveis de ambiente faltando. Verifique se MONGO_URI e JWT_SECRET estão definidas no seu arquivo .env na pasta backend.');
  process.exit(1);
}

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Conectado ao MongoDB');
}).catch(err => { 
  console.error('Erro ao conectar ao MongoDB:', err);
});

// --- Rotas da API (CRUD) ---

// Rotas de Autenticação
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Rota para servir o index.html principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
