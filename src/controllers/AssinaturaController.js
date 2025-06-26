//Gabriel Sarte
import { AssinaturaService } from "../services/AssinaturaService.js";

class AssinaturaController {

  static async findAll(req, res) {
    AssinaturaService.findAll()
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByPk(req, res) {
    AssinaturaService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async create(req, res) {
    AssinaturaService.create(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async update(req, res) {
    AssinaturaService.update(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async delete(req, res) {
    AssinaturaService.delete(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async relatorioAtivas(_req, res) {
    try {
      const data = await AssinaturaService.relatorioAtivas();

      if (!data || data.length === 0) {
        return res.status(200).json({ message: "Nenhuma assinatura ativa encontrada." });
      }

      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async relatorioVencimentoProximo(req, res) {
    try {
      const dias = parseInt(req.query.dias ?? '10', 10);
      const data = await AssinaturaService.relatorioVencimentoProximo(dias);

      if (!data || data.length === 0) {
        return res.status(200).json({ message: `Nenhuma assinatura com vencimento nos próximos ${dias} dias.` });
      }

      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export { AssinaturaController };
