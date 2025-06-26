import { Model, DataTypes } from 'sequelize';

class Fidelidade extends Model {
  static init(sequelize) {
    super.init({
      data_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: { args: true, msg: 'Data de início deve ser válida.' }
        }
      },
      data_fim: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: { args: true, msg: 'Data de fim deve ser válida.' },
          isAfterInicio(value) {
            if (this.data_inicio && value <= this.data_inicio) {
              throw new Error('Data de fim deve ser após a data de início.');
            }
          }
        }
      },
      beneficio_aplicado: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: { args: [0], msg: 'Benefício aplicado deve ser um valor positivo.' }
        }
      }
    }, {
      sequelize,
      modelName: 'Fidelidade',
      tableName: 'fidelidades',
      timestamps: true
    });
  }

  static associate(models) {
    this.belongsTo(models.cliente, {
      as: 'cliente',
      foreignKey: {
        name: 'cliente_id',
        allowNull: false
      }
    });
  }
}

export { Fidelidade };
