//Gabriel Sarte
import { Cliente } from "../models/Cliente.js";
import { Op } from "sequelize";


class ClienteService {

  static async findAll() {
    return await Cliente.findAll();
  }

  static async findByPk(req) {
    const { id } = req.params;
    return await Cliente.findByPk(id);
  }

  static async create(req) {
    const { nome, email, telefone, data_nascimento, dataCadastro } = req.body;

    const emailExistente = await Cliente.findOne({ where: { email } });
    if (emailExistente) {
      throw new Error("Já existe um cliente com este email");
    }

    const telefoneExistente = await Cliente.findOne({ where: { telefone } });
    if (telefoneExistente) {
      throw new Error("Já existe um cliente com este telefone");
    }

    try {
      return await Cliente.create({ nome, email, telefone, data_nascimento, dataCadastro });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new Error(error.errors.map(e => e.message).join(', '));
      }
      throw error; 
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, email, telefone, data_nascimento, dataCadastro } = req.body;


    let obj = await Cliente.findOne({ where: { id } });

    if (!obj) {
      throw new Error("Cliente não encontrado");
    }

    const emailExistente = await Cliente.findOne({ where: { email, id: { [Op.ne]: id } } });
    if (emailExistente) {
      throw new Error("Já existe um cliente com este email");
    }

    const telefoneExistente = await Cliente.findOne({ where: { telefone, id: { [Op.ne]: id } } });
    if (telefoneExistente) {
      throw new Error("Já existe um cliente com este telefone");
    }

    
    Object.assign(obj, {
        nome: nome !== undefined ? nome : obj.nome,
        email: email !== undefined ? email : obj.email,
        telefone: telefone !== undefined ? telefone : obj.telefone,
        data_nascimento: data_nascimento !== undefined ? data_nascimento : obj.data_nascimento,
        dataCadastro: dataCadastro !== undefined ? dataCadastro : obj.dataCadastro
    });

    try {
      return await obj.save();
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new Error(error.errors.map(e => e.message).join(', '));
      }
      throw error; 
    }
  }

  static async delete(req) {
    const { id } = req.params;
    let obj = await Cliente.findByPk(id);
    return await obj.destroy();
  }
}

export { ClienteService };
