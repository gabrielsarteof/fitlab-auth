//Gabriel Sarte
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

class Administrador extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "Nome do Administrador deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do Administrador deve ter entre 2 e 50 caracteres!" },
          is: {
            args: /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+$/,
            msg: "Nome inválido. Deve ser composto e iniciar com maiúsculas (Ex: Nome Sobrenome)."
          }
        }
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Senha do Administrador deve ser preenchida!" },
          len: { args: [6, 100], msg: "Senha deve ter no mínimo 6 caracteres." },
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/,
            msg: "Senha inválida. Deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
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
      }
    }, { 
      sequelize, 
      modelName: 'administrador', 
      tableName: 'administradores',
      hooks: {
        beforeCreate: async (admin) => {
          if (admin.senha) {
            const salt = await bcrypt.genSalt(10);
            admin.senha = await bcrypt.hash(admin.senha, salt);
          }
        },
        beforeUpdate: async (admin) => {
          if (admin.changed('senha')) {
            const salt = await bcrypt.genSalt(10);
            admin.senha = await bcrypt.hash(admin.senha, salt);
          }
        }
      }
    });
  }

  // Método para comparar senhas
  async checkPassword(password) {
    return await bcrypt.compare(password, this.senha);
  }
}

export { Administrador };