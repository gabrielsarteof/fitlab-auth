//Arthur
import { CheckInService } from "../services/CheckInService.js";

class CheckInController {
  
  static async findAll(req, res) {
    CheckInService.findAll()
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByPk(req, res) {
    CheckInService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async create(req, res) {
    CheckInService.create(req)
      .then(obj => res.status(201).json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async update(req, res) {
    CheckInService.update(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async delete(req, res) {
    CheckInService.delete(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByCliente(req, res) {
    CheckInService.findByCliente(req)
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findAutorizados(req, res) {
    CheckInService.findAutorizados(req)
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }
}

export { CheckInController };