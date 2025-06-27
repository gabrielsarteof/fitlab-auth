import express from "express";

import { AdministradorController } from './controllers/AdministradorController.js';
import { AssinaturaController } from './controllers/AssinaturaController.js';
import { CheckInController } from './controllers/CheckInController.js';
import { ClienteController } from './controllers/ClienteController.js';
import { DietaController } from './controllers/DietaController.js';
import { EstadoController } from './controllers/EstadoController.js';
import { NutricionistaController } from './controllers/NutricionistaController.js';
import { PersonalTrainerController } from './controllers/PersonalTrainerController.js';
import { PlanoController } from './controllers/PlanoController.js';
import { TreinoController } from './controllers/TreinoController.js';
import { AuthController } from './controllers/AuthController.js';
import { DashboardController } from './controllers/DashboardController.js';
import { authenticateToken } from '../src/_middleware/auth.js';

const routes = express.Router();

// Rotas de autenticação (públicas)
routes.post('/login', AuthController.login);
routes.post('/verify-token', AuthController.verifyToken);

// Rota protegida para obter dados do admin logado
routes.get('/me', authenticateToken, AuthController.me);

// Todas as outras rotas são protegidas
routes.use(authenticateToken);
routes.get('/dashboard/overview',DashboardController.overview);

routes.get('/administradores', AdministradorController.findAll);
routes.get('/administradores/:id', AdministradorController.findByPk);
routes.post('/administradores', AdministradorController.create);
routes.put('/administradores/:id', AdministradorController.update);
routes.delete('/administradores/:id', AdministradorController.delete);

routes.get('/assinaturas', AssinaturaController.findAll);
routes.get('/assinaturas/ativas', AssinaturaController.findActive);
routes.get('/assinaturas/:id', AssinaturaController.findByPk);
routes.post('/assinaturas', AssinaturaController.create);
routes.put('/assinaturas/:id', AssinaturaController.update);
routes.delete('/assinaturas/:id', AssinaturaController.delete);
routes.get('/assinaturas/relatorios/ativas', AssinaturaController.relatorioAtivas);
routes.get('/assinaturas/relatorios/vencimento-proximo', AssinaturaController.relatorioVencimentoProximo);

routes.get('/checkins', CheckInController.findAll);
routes.get('/checkins/:id', CheckInController.findByPk);
routes.post('/checkins', CheckInController.create);
routes.put('/checkins/:id', CheckInController.update);
routes.delete('/checkins/:id', CheckInController.delete);

routes.get('/clientes', ClienteController.findAll);
routes.get('/clientes/:id', ClienteController.findByPk);
routes.post('/clientes', ClienteController.create);
routes.put('/clientes/:id', ClienteController.update);
routes.delete('/clientes/:id', ClienteController.delete);

routes.get('/dietas', DietaController.findAll);
routes.get('/dietas/:id', DietaController.findByPk);
routes.post('/dietas', DietaController.create);
routes.put('/dietas/:id', DietaController.update);
routes.delete('/dietas/:id', DietaController.delete);

routes.get('/estados', EstadoController.findAll);
routes.get('/estados/:id', EstadoController.findByPk);
routes.post('/estados', EstadoController.create);
routes.put('/estados/:id', EstadoController.update);
routes.delete('/estados/:id', EstadoController.delete);
routes.get('/estados/relatorios/progresso/:id', EstadoController.evolucaoCliente);
routes.get('/estados/relatorios/recentes', EstadoController.estadosMaisRecentes);

routes.get('/nutricionistas', NutricionistaController.findAll);
routes.get('/nutricionistas/:id', NutricionistaController.findByPk);
routes.post('/nutricionistas', NutricionistaController.create);
routes.put('/nutricionistas/:id', NutricionistaController.update);
routes.delete('/nutricionistas/:id', NutricionistaController.delete);

routes.get('/personaltrainers', PersonalTrainerController.findAll);
routes.get('/personaltrainers/:id', PersonalTrainerController.findByPk);
routes.post('/personaltrainers', PersonalTrainerController.create);
routes.put('/personaltrainers/:id', PersonalTrainerController.update);
routes.delete('/personaltrainers/:id', PersonalTrainerController.delete);

routes.get('/planos', PlanoController.findAll);
routes.get('/planos/:id', PlanoController.findByPk);
routes.post('/planos', PlanoController.create);
routes.put('/planos/:id', PlanoController.update);
routes.delete('/planos/:id', PlanoController.delete);

routes.get('/treinos', TreinoController.findAll);
routes.get('/treinos/:id', TreinoController.findByPk);
routes.post('/treinos', TreinoController.create);
routes.put('/treinos/:id', TreinoController.update);
routes.delete('/treinos/:id', TreinoController.delete);

export default routes;