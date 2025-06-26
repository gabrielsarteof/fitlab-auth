//Arthur
import { Treino } from '../models/Treino.js';
import { Op } from 'sequelize';

class TreinoService {
  static async findAll() {
    try {
      const objs = await Treino.findAll({
        include: [
          { association: 'cliente', attributes: ['id', 'nome'] },
          { association: 'personal', attributes: ['id', 'nome'] }
        ]
      });
      return objs;
    } catch (err) {
      throw new Error(`Erro ao buscar treinos: ${err.message}`);
    }
  }

  static async findByPk(req) {
    const { id } = req.params;
    try {
      const obj = await Treino.findByPk(id, {
        include: [
          { association: 'cliente', attributes: ['id', 'nome'] },
          { association: 'personal', attributes: ['id', 'nome'] }
        ]
      });
      if (!obj) {
        throw new Error(`Treino com ID ${id} não encontrado.`);
      }
      return obj;
    } catch (err) {
      throw new Error(`Erro ao buscar treino por ID: ${err.message}`);
    }
  }

  static async create(req) {
    const { nivel, objetivo, expires_at, exercicios, cliente_id, personal_trainer_id } = req.body;
    
    try {
      const obj = await Treino.create({ 
        nivel,
        objetivo,
        expires_at,
        exercicios,
        cliente_id,
        personal_trainer_id
      });
      return obj;
    } catch (err) {
      throw new Error(`Erro ao criar treino: ${err.message}`);
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { nivel, objetivo, expires_at, exercicios, cliente_id, personal_trainer_id } = req.body;
    
    try {
      const obj = await Treino.findByPk(id);
      if (!obj) {
        throw new Error(`Treino com ID ${id} não encontrado.`);
      }
      
      Object.assign(obj, {
        nivel: nivel !== undefined ? nivel : obj.nivel,
        objetivo: objetivo !== undefined ? objetivo : obj.objetivo,
        expires_at: expires_at !== undefined ? expires_at : obj.expires_at,
        exercicios: exercicios !== undefined ? exercicios : obj.exercicios,
        cliente_id: cliente_id !== undefined ? cliente_id : obj.cliente_id,
        personal_trainer_id: personal_trainer_id !== undefined ? personal_trainer_id : obj.personal_trainer_id
      });
      
      await obj.save();
      return obj;
    } catch (err) {
      throw new Error(`Erro ao atualizar treino: ${err.message}`);
    }
  }

  static async delete(req) {
    const { id } = req.params;
    try {
      const obj = await Treino.findByPk(id);
      if (!obj) {
        throw new Error(`Treino com ID ${id} não encontrado.`);
      }
      await obj.destroy();
      return { message: `Treino com ID ${id} deletado com sucesso.` };
    } catch (err) {
      throw new Error(`Erro ao deletar treino: ${err.message}`);
    }
  }

  static async findByCliente(req) {
    const { cliente_id } = req.params;
    try {
      const objs = await Treino.findAll({
        where: { cliente_id },
        include: [
          { association: 'personal', attributes: ['id', 'nome'] }
        ],
        order: [['created_at', 'DESC']]
      });
      return objs;
    } catch (err) {
      throw new Error(`Erro ao buscar treinos por cliente: ${err.message}`);
    }
  }

  static async findByPersonal(req) {
    const { personal_trainer_id } = req.params;
    try {
      const objs = await Treino.findAll({
        where: { personal_trainer_id },
        include: [
          { association: 'cliente', attributes: ['id', 'nome'] }
        ],
        order: [['created_at', 'DESC']]
      });
      return objs;
    } catch (err) {
      throw new Error(`Erro ao buscar treinos por personal trainer: ${err.message}`);
    }
  }

  static async findAtivos(req) {
    try {
      const objs = await Treino.findAll({
        where: {
          expires_at: { [Op.gte]: new Date() }
        },
        include: [
          { association: 'cliente', attributes: ['id', 'nome'] },
          { association: 'personal', attributes: ['id', 'nome'] }
        ]
      });
      return objs;
    } catch (err) {
      throw new Error(`Erro ao buscar treinos ativos: ${err.message}`);
    }
  }
}

export { TreinoService };