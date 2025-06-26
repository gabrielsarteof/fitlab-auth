import jwt from 'jsonwebtoken';
import { Administrador } from '../models/Administrador.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ err: 'Token de acesso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verifica se o administrador ainda existe
    const admin = await Administrador.findByPk(decoded.id);
    if (!admin) {
      return res.status(401).json({ err: 'Administrador não encontrado' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ err: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ err: 'Token expirado' });
    }
    return res.status(500).json({ err: 'Erro interno do servidor' });
  }
};