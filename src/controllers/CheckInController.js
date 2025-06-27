import { CheckInService } from '../services/CheckInService.js';
import { ValidationError } from 'sequelize';

class CheckInController {
  // Lista todos os check-ins
  static async findAll(req, res) {
    try {
      const checkins = await CheckInService.findAll();
      return res.json(checkins);
    } catch (error) {
      console.error('[CheckInController.findAll] Erro interno:', error);
      return res.status(500).json({ message: 'Erro interno ao listar check-ins.' });
    }
  }

  // Busca um check-in por ID
  static async findByPk(req, res) {
    try {
      const checkin = await CheckInService.findByPk(req);
      if (!checkin) {
        return res.status(404).json({ message: 'Check-in não encontrado.' });
      }
      return res.json(checkin);
    } catch (error) {
      console.error('[CheckInController.findByPk] Erro interno:', error);
      return res.status(500).json({ message: 'Erro interno ao buscar check-in.' });
    }
  }

  // Cria um novo check-in
  static async create(req, res) {
    try {
      const novo = await CheckInService.create(req);
      return res.status(201).json(novo);
    } catch (error) {
      console.error('[CheckInController.create] Erro:', error);
      // Erro de regra de negócio (string lançada)
      if (typeof error === 'string') {
        return res.status(400).json({ message: error });
      }
      // Erro de validação do Sequelize
      if (error instanceof ValidationError) {
        const details = error.errors.map(e => ({ field: e.path, message: e.message }));
        return res.status(422).json({ message: 'Erro de validação.', errors: details });
      }
      // Qualquer outro erro
      return res.status(500).json({ message: 'Erro interno ao criar check-in.' });
    }
  }

  // Atualiza um check-in existente
  static async update(req, res) {
    try {
      const updated = await CheckInService.update(req);
      if (!updated) {
        return res.status(404).json({ message: 'Check-in não encontrado para atualizar.' });
      }
      return res.json(updated);
    } catch (error) {
      console.error('[CheckInController.update] Erro:', error);
      if (typeof error === 'string') {
        return res.status(400).json({ message: error });
      }
      if (error instanceof ValidationError) {
        const details = error.errors.map(e => ({ field: e.path, message: e.message }));
        return res.status(422).json({ message: 'Erro de validação.', errors: details });
      }
      return res.status(500).json({ message: 'Erro interno ao atualizar check-in.' });
    }
  }

  // Remove um check-in
  static async delete(req, res) {
    try {
      const removed = await CheckInService.delete(req);
      if (!removed) {
        return res.status(404).json({ message: 'Check-in não encontrado para exclusão.' });
      }
      return res.json({ message: 'Check-in excluído com sucesso.' });
    } catch (error) {
      console.error('[CheckInController.delete] Erro:', error);
      return res.status(500).json({ message: 'Erro interno ao excluir check-in.' });
    }
  }

  // Lista check-ins de um cliente específico (via assinatura)
  static async findByCliente(req, res) {
    try {
      const lista = await CheckInService.findByCliente(req);
      return res.json(lista);
    } catch (error) {
      console.error('[CheckInController.findByCliente] Erro:', error);
      return res.status(500).json({ message: 'Erro interno ao listar check-ins por cliente.' });
    }
  }

  // Lista apenas check-ins autorizados
  static async findAutorizados(req, res) {
    try {
      const lista = await CheckInService.findAutorizados(req);
      return res.json(lista);
    } catch (error) {
      console.error('[CheckInController.findAutorizados] Erro:', error);
      return res.status(500).json({ message: 'Erro interno ao listar check-ins autorizados.' });
    }
  }
}

export { CheckInController };
