import Sequelize from 'sequelize';
import { databaseConfig } from "./database-config.js";
import { Administrador } from '../models/Administrador.js';
import { Assinatura } from '../models/Assinatura.js';
import { CheckIn } from '../models/CheckIn.js';
import { Cliente } from '../models/Cliente.js';
import { Dieta } from '../models/Dieta.js';
import { Estado } from '../models/Estado.js';
import { Fidelidade } from '../models/Fidelidade.js'
import { Nutricionista } from '../models/Nutricionista.js';
import { PersonalTrainer } from '../models/PersonalTrainer.js';
import { Plano } from '../models/Plano.js';
import { Treino } from '../models/Treino.js';

const sequelize = new Sequelize(databaseConfig.url, databaseConfig);

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados bem-sucedida!');
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

Administrador.init(sequelize);
Assinatura.init(sequelize);
CheckIn.init(sequelize);
Cliente.init(sequelize);
Dieta.init(sequelize);
Estado.init(sequelize);
Fidelidade.init(sequelize);
Nutricionista.init(sequelize);
PersonalTrainer.init(sequelize);
Plano.init(sequelize);
Treino.init(sequelize);

const associateModels = (models) => {
    if (Cliente.associate) {
        Cliente.associate(models);
    }

    if (Administrador.associate) {
        Administrador.associate(models);
    }

    if (Assinatura.associate) {
        const originalAssociate = Assinatura.associate;

        Assinatura.associate = function (models) {
            if (!this._associationsDone) {
                originalAssociate.call(this, models);
                this._associationsDone = true;
            }
        };

        Assinatura.associate(models);
    }

    if (CheckIn.associate) {
        const originalAssociate = CheckIn.associate;

        CheckIn.associate = function (models) {
            if (!this._associationsDone) {
                originalAssociate.call(this, models);
                this._associationsDone = true;
            }
        };

        CheckIn.associate(models);
    }

    if (Dieta.associate) {
        const originalAssociate = Dieta.associate;

        Dieta.associate = function (models) {
            if (!this._associationsDone) {
                originalAssociate.call(this, models);
                this._associationsDone = true;
            }
        };

        Dieta.associate(models);
    }

    if (Estado.associate) {
        const originalAssociate = Estado.associate;

        Estado.associate = function (models) {
            if (!this._associationsDone) {
                originalAssociate.call(this, models);
                this._associationsDone = true;
            }
        };

        Estado.associate(models);
    }

    if (Fidelidade.associate) {
        Fidelidade.associate(models);
    }


    if (Nutricionista.associate) {
        Nutricionista.associate(models);
    }

    if (PersonalTrainer.associate) {
        PersonalTrainer.associate(models);
    }

    if (Plano.associate) {
        Plano.associate(models);
    }

    if (Treino.associate) {
        const originalAssociate = Treino.associate;

        Treino.associate = function (models) {
            if (!this._associationsDone) {
                originalAssociate.call(this, models);
                this._associationsDone = true;
            }
        };

        Treino.associate(models);
    }
};

associateModels(sequelize.models);

export default sequelize;