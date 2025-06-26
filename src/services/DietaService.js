//Arthur
import { Dieta } from '../models/Dieta.js';

class DietaService {
  static async findAll() {
    try {
      const objs = await Dieta.findAll({
        include: [
          { association: 'cliente', attributes: ['id', 'nome'] },
          { association: 'nutricionista', attributes: ['id', 'nome'] }
        ]
      });
      return objs;
    } catch (err) {
      throw new Error(`Erro ao buscar dietas: ${err.message}`);
    }
  }

  static async findByPk(req) {
    const { id } = req.params;
    try {
      const obj = await Dieta.findByPk(id, {
        include: [
          { association: 'cliente', attributes: ['id', 'nome'] },
          { association: 'nutricionista', attributes: ['id', 'nome'] }
        ]
      });
      if (!obj) {
        throw new Error(`Dieta com ID ${id} não encontrada.`);
      }
      return obj;
    } catch (err) {
      throw new Error(`Erro ao buscar dieta por ID: ${err.message}`);
    }
  }

  static async create(req) {
    const { descricao, created_at, expires_at, instrucoes, cliente_id, nutricionista_id } = req.body;
    
    if (!descricao || !instrucoes || !expires_at || !cliente_id || !nutricionista_id) {
      throw new Error('Descrição, instruções, data de expiração, cliente e nutricionista são obrigatórios.');
    }
    
    try {
      const obj = await Dieta.create({ 
        descricao, 
        created_at: created_at || new Date(),
        expires_at,
        instrucoes,
        cliente_id,
        nutricionista_id
      });
      return obj;
    } catch (err) {
      throw new Error(`Erro ao criar dieta: ${err.message}`);
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { descricao, expires_at, instrucoes, cliente_id, nutricionista_id } = req.body;
    
    try {
      const obj = await Dieta.findByPk(id);
      if (!obj) {
        throw new Error(`Dieta com ID ${id} não encontrada.`);
      }
      
      Object.assign(obj, {
        descricao: descricao !== undefined ? descricao : obj.descricao,
        expires_at: expires_at !== undefined ? expires_at : obj.expires_at,
        instrucoes: instrucoes !== undefined ? instrucoes : obj.instrucoes,
        cliente_id: cliente_id !== undefined ? cliente_id : obj.cliente_id,
        nutricionista_id: nutricionista_id !== undefined ? nutricionista_id : obj.nutricionista_id
      });
      
      await obj.save();
      return obj;
    } catch (err) {
      throw new Error(`Erro ao atualizar dieta: ${err.message}`);
    }
  }

  static async delete(req) {
    const { id } = req.params;
    try {
      const obj = await Dieta.findByPk(id);
      if (!obj) {
        throw new Error(`Dieta com ID ${id} não encontrada.`);
      }
      await obj.destroy();
      return { message: `Dieta com ID ${id} deletada com sucesso.` };
    } catch (err) {
      throw new Error(`Erro ao deletar dieta: ${err.message}`);
    }
  }

  static async findByCliente(req) {
    const { cliente_id } = req.params;
    try {
      const objs = await Dieta.findAll({
        where: { cliente_id },
        include: [
          { association: 'nutricionista', attributes: ['id', 'nome'] }
        ]
      });
      return objs;
    } catch (err) {
      throw new Error(`Erro ao buscar dietas por cliente: ${err.message}`);
    }
  }

  static async findByNutricionista(req) {
    const { nutricionista_id } = req.params;
    try {
      const objs = await Dieta.findAll({
        where: { nutricionista_id },
        include: [
          { association: 'cliente', attributes: ['id', 'nome'] }
        ]
      });
      return objs;
    } catch (err) {
      throw new Error(`Erro ao buscar dietas por nutricionista: ${err.message}`);
    }
  }
}

export { DietaService };