import { PersonalTrainerService } from "../services/PersonalTrainerService.js";

class PersonalTrainerController {
  
  static async findAll(req, res) {
    PersonalTrainerService.findAll()
      .then(objs => res.json(objs))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async findByPk(req, res) {
    PersonalTrainerService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async create(req, res) {
    PersonalTrainerService.create(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async update(req, res) {
    PersonalTrainerService.update(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }

  static async delete(req, res) {
    PersonalTrainerService.delete(req)
      .then(obj => res.json(obj))
      .catch(err => res.status(400).json({ err: err.message }));
  }
}

export { PersonalTrainerController };
