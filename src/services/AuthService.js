import jwt from 'jsonwebtoken';
import { Administrador } from '../models/Administrador.js';

class AuthService {
  
  static async login(req) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Busca o administrador pelo email
    const admin = await Administrador.findOne({ where: { email } });
    if (!admin) {
      throw new Error('Credenciais inválidas');
    }

    // Verifica a senha
    const isValidPassword = await admin.checkPassword(senha);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    // Gera o token JWT
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email,
        nome: admin.nome 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
      }
    );

    // Retorna os dados do admin sem a senha
    const { senha: _, ...adminData } = admin.toJSON();
    
    return {
      admin: adminData,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };
  }

  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Administrador.findByPk(decoded.id);
      
      if (!admin) {
        throw new Error('Administrador não encontrado');
      }

      const { senha: _, ...adminData } = admin.toJSON();
      return adminData;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}

export { AuthService };