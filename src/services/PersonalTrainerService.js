//Matheus Cardoso
import { PersonalTrainer } from "../models/PersonalTrainer.js";
import { Op } from "sequelize";

class PersonalTrainerService {
  
  static async findAll() {
    return await PersonalTrainer.findAll();
  }

  static async findByPk(req) {
    const { id } = req.params;
    return await PersonalTrainer.findByPk(id);
  }

  static async create(req) {
    const { nome, certificacao, email, telefone, horario_atendimento, especialidade } = req.body;
    
    // Verifica se já existe um PersonalTrainer com o mesmo email
    const existingEmail = await PersonalTrainer.findOne({ where: { email } });
    if (existingEmail) {
      throw new Error("Já existe um Personal Trainer com este e-mail");
    }

    // Verifica se já existe um PersonalTrainer com o mesmo telefone
    const existingTelefone = await PersonalTrainer.findOne({ where: { telefone } });
    if (existingTelefone) {
      throw new Error("Já existe um PersonalTrainer com este telefone");
    }

    return await PersonalTrainer.create({ nome, certificacao, email, telefone, horario_atendimento, especialidade });
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, certificacao, email, telefone, horario_atendimento, especialidade } = req.body;
    let obj = await PersonalTrainer.findOne({ where: { id } });
    
    // Verifica se o novo email já existe em outro Personal Trainer
    const existingEmail = await PersonalTrainer.findOne({
      where: {
        id: { [Op.ne]: id },
        email
      }
    });
    if (existingEmail) {
      throw new Error("Já existe um Personal Trainer com este e-mail");
    }

    // Verifica se o novo telefone já existe em outro Personal Trainer
    const existingTelefone = await PersonalTrainer.findOne({
      where: {
        id: { [Op.ne]: id },
        telefone
      }
    });
    if (existingTelefone) {
      throw new Error("Já existe um Personal Trainer com este telefone");
    }
    
    Object.assign(obj, { nome, certificacao, email, telefone, horario_atendimento, especialidade });
    return await obj.save();
  }

  static async delete(req) {
    const { id } = req.params;
    let obj = await PersonalTrainer.findByPk(id);
    return await obj.destroy();
  }
}

export { PersonalTrainerService };