import { EstadoService } from "../services/EstadoService.js";

class EstadoController {

  static async findAll(req, res) {
    EstadoService.findAll()
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByPk(req, res) {
    EstadoService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async create(req, res) {
    EstadoService.create(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async update(req, res) {
    EstadoService.update(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async delete(req, res) {
    EstadoService.delete(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async evolucaoCliente(req, res) { // Mudou de _req para req
    try {
      const data = await EstadoService.evolucaoCliente(req); // Passou o req

      if (!data || data.length === 0) {
        return res.status(200).json({ message: `Nenhum registro de estado encontrado.` });
      }

      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async estadosMaisRecentes(_req, res) {
    try {
      const data = await EstadoService.estadosMaisRecentes();

      if (!data || data.length === 0) {
        return res.status(200).json({ message: `Erro ao buscar estados recentes.` });
      }

      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}



export { EstadoController };
