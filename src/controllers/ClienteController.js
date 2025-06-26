//Gabriel Sarte
import { ClienteService } from "../services/ClienteService.js";

class ClienteController {
  
  static async findAll(req, res) {
    ClienteService.findAll()
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByPk(req, res) {
    ClienteService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async create(req, res) {
    ClienteService.create(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async update(req, res) {
    ClienteService.update(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async delete(req, res) {
    ClienteService.delete(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }
}

export { ClienteController };
