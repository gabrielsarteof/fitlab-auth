// src/models/index.js

import { Sequelize } from 'sequelize';
import { Administrador } from "./Administrador.js";
import { Assinatura } from './Assinatura.js';
import { CheckIn } from './CheckIn.js';
import { Cliente } from './Cliente.js';
import { Dieta } from './Dieta.js';
import { Estado } from './Estado.js';
import { Fidelidade } from './Fidelidade.js';
import { Nutricionista } from './Nutricionista.js';
import { PersonalTrainer } from './PersonalTrainer.js';
import { Plano } from './Plano.js';
import { Treino } from './Treino.js';

export {
  Administrador,
  Assinatura,
  CheckIn,
  Cliente,
  Dieta,
  Estado,
  Fidelidade,
  Nutricionista,
  PersonalTrainer,
  Plano,
  Treino
};
