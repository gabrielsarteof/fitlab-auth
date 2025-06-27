import { Model, DataTypes } from 'sequelize';

class Assinatura extends Model {
  static init(sequelize) {
    return super.init({
      desconto: {
        type: DataTypes.FLOAT,
        validate: {
          min: { args: [0], msg: 'Desconto não pode ser negativo!' },
          max: { args: [100], msg: 'Desconto não pode ser maior que 100%!' }
        }
      },
      valor: {
        type: DataTypes.FLOAT,
        validate: {
          notEmpty: { msg: 'Valor deve ser preenchido!' },
          min: { args: [0], msg: 'Valor deve ser maior que zero!' }
        }
      },
      metodo_pagamento: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Método de Pagamento deve ser preenchido!' },
          len: { args: [3, 50], msg: 'Método de Pagamento deve ter entre 3 e 50 caracteres!' }
        }
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Data de Expiração deve ser preenchida!' },
          isDate: { msg: 'Data de Expiração deve ser uma data válida!' }
        }
      },
      status: {
        type: DataTypes.VIRTUAL,
        get() {
          const exp = this.getDataValue('expires_at');
          if (!exp) return null;
          const now = Date.now();
          const ms = exp.getTime() - now;
          if (ms < 0) return 'vencida';
          if (ms <= 7 * 24 * 60 * 60 * 1000) return 'proxima';
          return 'ativa';
        }
      }
    }, {
      sequelize,
      modelName: 'assinatura',
      tableName: 'assinaturas',
      defaultScope: {
        attributes: {
          include: ['status']
        }
      },
      scopes: {
        active: {
          where: sequelize.where(
            sequelize.literal(`
          CASE
            WHEN "expires_at" < NOW() THEN 'vencida'
            WHEN "expires_at" BETWEEN NOW() AND NOW() + INTERVAL '7 days' THEN 'proxima'
            ELSE 'ativa'
          END
        `),
            'ativa'
          )
        }
      },
      hooks: {
        beforeValidate: (assinatura) => {
          if (!assinatura.expires_at) {
            const d = new Date();
            d.setMonth(d.getMonth() + 1);
            assinatura.expires_at = d;
          }
        }
      }
    });
  }

  static associate(models) {
    this.belongsTo(models.cliente, {
      as: 'cliente',
      foreignKey: 'cliente_id',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    this.belongsTo(models.plano, {
      as: 'plano',
      foreignKey: 'plano_id',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    this.hasMany(models.checkIn, {
      as: 'checkins',
      foreignKey: 'assinatura_id',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  }
}

export { Assinatura };
