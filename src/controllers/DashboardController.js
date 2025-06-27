// src/controllers/DashboardController.js
import { DashboardService } from '../services/DashboardService.js'

class DashboardController {
  static async overview(req, res) {
    DashboardService.overview(req)
      .then(data => res.json(data))
      .catch(err => res.status(400).json({ err: err.message }))
  }
}

export { DashboardController }
