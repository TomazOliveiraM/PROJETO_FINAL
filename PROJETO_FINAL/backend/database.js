const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado ao MongoDB!");
  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
}

module.exports = connectDB;
