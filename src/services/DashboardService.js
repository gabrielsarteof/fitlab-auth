// src/services/DashboardService.js

import { Cliente } from '../models/Cliente.js'
import { Assinatura } from '../models/Assinatura.js'
import { CheckIn } from '../models/CheckIn.js'
import { Op, fn, col, literal } from 'sequelize'

export class DashboardService {
  
  /**
   * Converte timestamptz para hora local brasileira
   */
  static getLocalHour(timestamp) {
    const date = new Date(timestamp)
    
    try {
      // Usar timezone do Brasil
      const localTime = date.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour12: false,
        hour: '2-digit'
      })
      return parseInt(localTime, 10)
    } catch (error) {
      // Fallback: ajuste manual para UTC-3 (Brasil)
      const utcHour = date.getUTCHours()
      return (utcHour - 3 + 24) % 24
    }
  }

  /**
   * Debug detalhado do timestamp
   */
  static debugTimestamp(timestamp) {
    const date = new Date(timestamp)
    return {
      original: timestamp,
      iso: date.toISOString(),
      utc_hour: date.getUTCHours(),
      local_hour_js: date.getHours(),
      local_hour_br: this.getLocalHour(timestamp),
      timezone_offset: date.getTimezoneOffset(),
      locale_br: date.toLocaleString('pt-BR', { 
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  static async overview() {
    // --- 1) Datas-base ---
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const amanha = new Date(hoje)
    amanha.setDate(hoje.getDate() + 1)

    const dezDias = new Date(hoje)
    dezDias.setDate(hoje.getDate() + 10)

    const semanaAtras = new Date(hoje)
    semanaAtras.setDate(hoje.getDate() - 7)

    // --- 2) Totais gerais ---
    const totalClientes = await Cliente.count()

    const assinaturasAtivas = await Assinatura.count({
      where: { expires_at: { [Op.gt]: hoje } }
    })

    const assinaturasVencendoEm10Dias = await Assinatura.count({
      where: { expires_at: { [Op.between]: [hoje, dezDias] } }
    })

    const novasAssinaturasSemana = await Assinatura.count({
      where: { createdAt: { [Op.gte]: semanaAtras } }
    })

    const checkinsHoje = await CheckIn.count({
      where: { entrada: { [Op.gte]: hoje, [Op.lt]: amanha } }
    })

    const clientesNaAcademia = await CheckIn.count({
      where: {
        saida: null,
        entrada: { [Op.gte]: hoje }
      }
    })

    // --- 3) Série histórica de novos (últimos 6 meses) ---
    const meses = Array.from({ length: 6 }, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (5 - i))
      return d
    })
    const labels = meses.map(d =>
      d.toLocaleString('pt-BR', { month: 'short' })
    )
    const novos = await Promise.all(
      meses.map(d => {
        const inicio = new Date(d.getFullYear(), d.getMonth(), 1)
        const fim = new Date(inicio)
        fim.setMonth(fim.getMonth() + 1)
        return Assinatura.count({
          where: { createdAt: { [Op.gte]: inicio, [Op.lt]: fim } }
        })
      })
    )

    // --- 4) Check-ins recentes (com nome do cliente) ---
    const raw = await CheckIn.findAll({
      limit: 10,
      order: [['entrada', 'DESC']],
      include: [
        {
          model: Assinatura,
          as: 'assinatura',
          include: [{ model: Cliente, as: 'cliente', attributes: ['nome'] }]
        }
      ]
    })
    const recentCheckins = raw.map(ci => ({
      cliente: ci.assinatura.cliente.nome,
      hora: ci.entrada
    }))

    // --- 5) Ocupação por hora ---
    const todayCheckins = await CheckIn.findAll({
      where: { entrada: { [Op.gte]: hoje, [Op.lt]: amanha } },
      attributes: ['entrada'],
      order: [['entrada', 'ASC']]
    })

    let ocupacaoPorHora = {}

    try {
      const occ = await CheckIn.findAll({
        attributes: [
          [literal("EXTRACT(HOUR FROM (entrada AT TIME ZONE 'America/Sao_Paulo'))"), 'hora'],
          [fn('COUNT', col('*')), 'qtd']
        ],
        where: { entrada: { [Op.gte]: hoje, [Op.lt]: amanha } },
        group: [literal("EXTRACT(HOUR FROM (entrada AT TIME ZONE 'America/Sao_Paulo'))")],
        raw: true
      })

      if (occ.length > 0) {
        ocupacaoPorHora = occ.reduce((acc, row) => {
          const hora = parseInt(row.hora, 10)
          const qtd = parseInt(row.qtd, 10)
          acc[hora] = qtd
          return acc
        }, {})
      } else {
        throw new Error('Query retornou vazia')
      }

    } catch (error) {
      ocupacaoPorHora = todayCheckins.reduce((acc, checkin) => {
        const hora = this.getLocalHour(checkin.entrada)
        acc[hora] = (acc[hora] || 0) + 1
        return acc
      }, {})
    }

    // --- Monta e devolve o JSON final ---
    const result = {
      stats: {
        totalClientes,
        assinaturasAtivas,
        assinaturasVencendoEm10Dias,
        novasAssinaturasSemana,
        checkinsHoje,
        clientesNaAcademia
      },
      chart: { labels, novos },
      recentCheckins,
      ocupacaoPorHora
    }

    return result
  }
}