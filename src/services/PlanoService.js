// Gabriel Sarte
import { Plano } from '../models/Plano.js';

class PlanoService {

  static async findAll() {
    try {
      const objs = await Plano.findAll();
      return objs;
    } catch (err) {
      throw new Error(`Erro ao buscar planos: ${err.message}`);
    }
  }

  static async findByPk(req) {
    const { id } = req.params;
    try {
      const obj = await Plano.findByPk(id);
      if (!obj) {
        throw new Error(`Plano com ID ${id} não encontrado.`);
      }
      return obj;
    } catch (err) {
      throw new Error(`Erro ao buscar plano por ID: ${err.message}`);
    }
  }

  static async create(req) {
    const { nome, frequencia, valor } = req.body;
    if (!nome || !frequencia || valor == null) {
      throw new Error('Nome, frequência e valor são obrigatórios.');
    }
    try {
      const obj = await Plano.create({ nome, frequencia, valor });
      return obj;
    } catch (err) {
      throw new Error(`Erro ao criar plano: ${err.message}`);
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, frequencia, valor } = req.body;
    try {
      const obj = await Plano.findByPk(id);
      if (!obj) {
        throw new Error(`Plano com ID ${id} não encontrado.`);
      }
      Object.assign(obj, {
        nome: nome !== undefined ? nome : obj.nome,
        frequencia: frequencia !== undefined ? frequencia : obj.frequencia,
        valor: valor !== undefined ? valor : obj.valor
      });
      await obj.save();
      return obj;
    } catch (err) {
      throw new Error(`Erro ao atualizar plano: ${err.message}`);
    }
  }

  static async delete(req) {
    const { id } = req.params;
    try {
      const obj = await Plano.findByPk(id);
      if (!obj) {
        throw new Error(`Plano com ID ${id} não encontrado.`);
      }
      await obj.destroy();
      return { message: `Plano com ID ${id} deletado com sucesso.` };
    } catch (err) {
      throw new Error(`Erro ao deletar plano: ${err.message}`);
    }
  }

}

export { PlanoService }; 
