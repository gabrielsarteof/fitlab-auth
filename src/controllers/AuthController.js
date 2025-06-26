import { AuthService } from "../services/AuthService.js";

class AuthController {
  
  static async login(req, res) {
    try {
      const result = await AuthService.login(req);
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error) {
      res.status(401).json({ 
        success: false,
        err: error.message 
      });
    }
  }

  static async verifyToken(req, res) {
    try {
      const { token } = req.body;
      const admin = await AuthService.verifyToken(token);
      res.json({
        success: true,
        message: 'Token válido',
        data: { admin }
      });
    } catch (error) {
      res.status(401).json({ 
        success: false,
        err: error.message 
      });
    }
  }

  static async me(req, res) {
    try {
      // O middleware auth já coloca o admin em req.admin
      const { senha: _, ...adminData } = req.admin.toJSON();
      res.json({
        success: true,
        data: { admin: adminData }
      });
    } catch (error) {
      res.status(400).json({ 
        success: false,
        err: error.message 
      });
    }
  }
}

export { AuthController };