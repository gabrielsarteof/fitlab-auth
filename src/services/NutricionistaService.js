//Matheus Cardoso
import { Nutricionista } from "../models/Nutricionista.js";
import { Op } from "sequelize";

class NutricionistaService {
  
  static async findAll() {
    return await Nutricionista.findAll();
  }

  static async findByPk(req) {
    const { id } = req.params;
    return await Nutricionista.findByPk(id);
  }

  static async create(req) {
    const { nome, email, telefone, horario_atendimento } = req.body;
    
    // Verifica se já existe um Nutricionista com o mesmo email
    const existingEmail = await Nutricionista.findOne({ where: { email } });
    if (existingEmail) {
      throw new Error("Já existe um nutricionista com este e-mail");
    }

    // Verifica se já existe um Nutricionista com o mesmo telefone
    const existingTelefone = await Nutricionista.findOne({ where: { telefone } });
    if (existingTelefone) {
      throw new Error("Já existe um nutricionista com este telefone");
    }

    return await Nutricionista.create({ nome, email, telefone, horario_atendimento });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, email, telefone, horario_atendimento } = req.body;
    let obj = await Nutricionista.findOne({ where: { id } });
    
    // Verifica se o novo email já existe em outro Nutricionista
    const existingEmail = await Nutricionista.findOne({
      where: {
        id: { [Op.ne]: id },
        email
      }
    });
    if (existingEmail) {
      throw new Error("Já existe um Nutricionista com este e-mail");
    }

    // Verifica se o novo telefone já existe em outro Nutricionista
    const existingTelefone = await Nutricionista.findOne({
      where: {
        id: { [Op.ne]: id },
        telefone
      }
    });
    if (existingTelefone) {
      throw new Error("Já existe um Nutricionista com este telefone");
    }
    
    Object.assign(obj, { nome, email, telefone, horario_atendimento });
    return await obj.save();
  }

  static async delete(req) {
    const { id } = req.params;
    let obj = await Nutricionista.findByPk(id);
    return await obj.destroy();
  }
}

export { NutricionistaService };