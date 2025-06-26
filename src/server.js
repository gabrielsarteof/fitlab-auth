import express from "express";
import dotenv from 'dotenv';
import cors from "cors";  
dotenv.config();

import routes from './routes.js';
import errorHandler from '../src/_middleware/error-handler.js';
import sequelize from './config/database-connection.js';

const app = express();

const whitelist = [
  process.env.FRONTEND_URL,                 // ex: "https://meu-app-em-produto.com"
  "http://localhost:5173"                   // desenvolvimento
];

const corsOptions = {
  origin: (origin, callback) => {
    // permitir requisições sem origin (ex: em testes via Postman)
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Não permitido por CORS"));
    }
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));               
app.options("*", cors(corsOptions)); 

app.use(express.json());
app.use(routes);
app.use(errorHandler);

(async () => {
  try {
    // await sequelize.sync({ force: true }); 
    // console.log('Banco sincronizado com sucesso.');

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao sincronizar banco:', error);
  }
})
();