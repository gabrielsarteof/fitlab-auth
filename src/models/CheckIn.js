//Arthur
import { Model, DataTypes } from 'sequelize';

class CheckIn extends Model {
  static init(sequelize) {
    super.init({
      entrada: {
        type: DataTypes.DATE, // Tipo correto para armazenar data e hora
        allowNull: false,
        validate: {
          notNull: { msg: 'Horário de entrada é obrigatório' },
          isValidDateTimeFormat(value) {
            if (!(value instanceof Date) || isNaN(value.getTime())) {
              throw new Error('Valor de data/hora inválido');
            }
          }
        }
      },
      saida: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isAfterEntrada(value) {
            if (value && this.entrada && new Date(value) <= new Date(this.entrada)) {
              throw new Error('Horário de saída deve ser após o horário de entrada');
            }
          }
        }
      },
      acesso_autorizado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
          isBoolean(value) {
            if (typeof value !== 'boolean') {
              throw new Error('O campo "acesso_autorizado" deve ser verdadeiro ou falso');
            }
          }
        }
      },
      razao_bloqueio: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 100],
            msg: 'Razão do bloqueio não pode ter mais que 100 caracteres'
          }
        }
      }
    }, {
      sequelize,
      modelName: 'checkin',
      tableName: 'checkins',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.assinatura, {
      as: 'assinatura',
      foreignKey: {
        name: 'assinatura_id',
        allowNull: false,
        validate: {
          notNull: { msg: 'O campo assinatura_id deve ser preenchido com um valor válido!' }
        }
      }
    });
  }
}

export { CheckIn };
