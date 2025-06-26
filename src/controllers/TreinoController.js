//Arthur
import { TreinoService } from "../services/TreinoService.js";

class TreinoController {
  
  static async findAll(req, res) {
    TreinoService.findAll()
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByPk(req, res) {
    TreinoService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async create(req, res) {
    TreinoService.create(req)
      .then(obj => res.status(201).json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async update(req, res) {
    TreinoService.update(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async delete(req, res) {
    TreinoService.delete(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByCliente(req, res) {
    TreinoService.findByCliente(req)
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByPersonal(req, res) {
    TreinoService.findByPersonal(req)
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findAtivos(req, res) {
    TreinoService.findAtivos(req)
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }
}

export { TreinoController };