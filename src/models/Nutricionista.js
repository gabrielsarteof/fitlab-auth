//Matheus Cardoso
import { Model, DataTypes } from 'sequelize';

class Nutricionista extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "Nome não pode ficar vazio." },
          len: {args: [1, 50],  msg: "Nome pode ter no máximo 50 caracteres." },
        }
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "Email não pode ficar vazio." },
          len: {args: [1, 50],  msg: "Email pode ter no máximo 50 caracteres." },
        }
      },
      telefone: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "Telefone não pode ficar vazio." },
          is: {args: /^\([0-9]{2}\) [0-9]?[0-9]{4}-[0-9]{4}/, msg: "Telefone deve seguir o padrão (NN) NNNNN-NNNN" },
        }
      },
      horario_atendimento: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "Horário de atendimento não pode ficar vazio." },
        }
      },
    }, { sequelize, modelName: 'nutricionista', tableName: 'nutricionistas' });
  }
}


export { Nutricionista };
