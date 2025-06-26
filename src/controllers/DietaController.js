//Arthur 
import { DietaService } from "../services/DietaService.js";

class DietaController {
  
  static async findAll(req, res) {
    DietaService.findAll()
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByPk(req, res) {
    DietaService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async create(req, res) {
    DietaService.create(req)
      .then(obj => res.status(201).json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async update(req, res) {
    DietaService.update(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async delete(req, res) {
    DietaService.delete(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByCliente(req, res) {
    DietaService.findByCliente(req)
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByNutricionista(req, res) {
    DietaService.findByNutricionista(req)
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }
}

export { DietaController };