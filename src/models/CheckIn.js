import { Model, DataTypes } from 'sequelize';

class CheckIn extends Model {
  static init(sequelize) {
    return super.init({
      entrada: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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
        defaultValue: true
      },
      razao_bloqueio: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: { args: [0, 100], msg: 'Razão do bloqueio não pode ter mais que 100 caracteres' }
        }
      },
      assinatura_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'assinaturas', key: 'id' },
        validate: {
          notNull: { msg: 'O campo assinatura_id é obrigatório' },
          isInt:   { msg: 'assinatura_id deve ser um inteiro' }
        }
      }
    }, {
      sequelize,
      modelName: 'checkIn',
      tableName: 'checkins',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.assinatura, {
      as: 'assinatura',
      foreignKey: 'assinatura_id',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  }
}

export { CheckIn };
