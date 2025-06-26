import { NutricionistaService } from "../services/NutricionistaService.js";

class NutricionistaController {
  
  static async findAll(req, res) {
    NutricionistaService.findAll()
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByPk(req, res) {
    NutricionistaService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async create(req, res) {
    NutricionistaService.create(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async update(req, res) {
    NutricionistaService.update(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async delete(req, res) {
    NutricionistaService.delete(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }
}

export { NutricionistaController };
