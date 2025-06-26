//Gabriel Sarte
import { Model, DataTypes } from 'sequelize';

class Plano extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      frequencia: DataTypes.STRING,
      valor: DataTypes.FLOAT
    }, { sequelize, modelName: 'plano', tableName: 'planos' });
  }
}

export { Plano};
