//Arthur
import { Model, DataTypes } from 'sequelize';

class Treino extends Model {  
  static init(sequelize) {
    super.init({
      nivel: {
        type: DataTypes.ENUM('Iniciante', 'Intermediário', 'Avançado'), 
        allowNull: false,
        validate: {
          notNull: { msg: 'Nível é obrigatório' }, 
          notEmpty: { msg: 'Nível não pode ser vazio' }, 
          isIn: { 
            args: [['Iniciante', 'Intermediário', 'Avançado']],
            msg: 'Nível deve ser Iniciante, Intermediário ou Avançado'
          }
        }
      },
      objetivo: {
        type: DataTypes.STRING(100), 
        allowNull: false,
        validate: {
          notNull: { msg: 'Objetivo é obrigatório' }, 
          notEmpty: { msg: 'Objetivo não pode ser vazio' }, 
          len: { 
            args: [3, 100],
            msg: 'Objetivo deve ter entre 3 e 100 caracteres'
          }
        }
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, 
        validate: {
          isDate: { msg: 'Data de criação inválida' } 
        }
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: 'Data de expiração é obrigatória' }, 
          isDate: { msg: 'Data de expiração deve ser válida' }, 
          isAfter: { 
            args: new Date().toISOString(),
            msg: 'Data de expiração deve ser futura'
          },
          isAftercreated_at(value) { 
            if (this.created_at && value <= this.created_at) {
              throw new Error('Data de expiração deve ser após a criação');
            }
          }
        }
      },
      exercicios: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: 'Exercícios são obrigatórios' }, 
          notEmpty: { msg: 'Exercícios não podem ser vazios' } 
        }
      }
    }, { 
      sequelize, 
      modelName: 'treino',  
      tableName: 'treinos', 
      timestamps: false,
      hooks: {
        beforeValidate: (treino) => {
          if (!treino.created_at) {
            treino.created_at = new Date();
          }
        }
      }
    });
  }

  static associate(models) {
    this.belongsTo(models.cliente, {
      as: 'cliente',
      foreignKey: {
        name: 'cliente_id',
        allowNull: false,
        validate: { 
          notNull: { msg: 'Cliente é obrigatório' } 
        }
      }
    });

    this.belongsTo(models.personalTrainer, {
      as: 'personal',
      foreignKey: {
        name: 'personal_trainer_id',
        allowNull: false,
        validate: { 
          notNull: { msg: 'Personal Trainer é obrigatório' } 
        }
      }
    });
  }
}

export { Treino };