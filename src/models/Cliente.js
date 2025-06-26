//Gabriel Sarte
import { Model, DataTypes } from 'sequelize';

class Cliente extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "Nome do Cliente deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do Cliente deve ter entre 2 e 50 caracteres!" },
          is: {
            args: /^[A-ZÀ-Ý][a-zà-ÿ]+(?:\s(?:[a-zà-ÿ]+|[A-ZÀ-Ý][a-zà-ÿ]+))*$/,
            msg: "Nome inválido. Deve ser composto por palavras iniciando com maiúsculas ou preposições em minúsculas."
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: "unique_email",
          msg: "Este e-mail já está em uso. Escolha outro."
        },
        validate: {
          notEmpty: { msg: "E-mail do Administrador deve ser preenchido!" },
          isEmail: { msg: "E-mail do Administrador deve ser válido!" },
        }
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: "unique_telefone",
          msg: "Este telefone já está em uso. Escolha outro."
        },
        validate: {
          notEmpty: { msg: "Telefone do Administrador deve ser preenchido!" },
          len: { args: [10, 15], msg: "Telefone do Administrador deve ter entre 10 e 15 caracteres!" }
        }
      },
      data_nascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Data de Nascimento deve ser preenchida!" },
          isDate: { msg: "Data de Nascimento deve ser uma data válida!" },
          isOldEnough(value) {
            const birthDate = new Date(value);
            if (isNaN(birthDate.getTime())) {
              throw new Error("Data de Nascimento inválida.");
            }
      
            const today = new Date();
            const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
      
            if (birthDate > minAgeDate) { 
              throw new Error("O cliente deve ter pelo menos 16 anos.");
            }
          }
        }
      }
      
    }, { sequelize, modelName: 'cliente', tableName: 'clientes' });
  }
}

export { Cliente };
