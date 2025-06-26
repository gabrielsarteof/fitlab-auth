//Gabriel Sarte
import { Assinatura } from "../models/Assinatura.js";
import { Cliente } from "../models/Cliente.js";
import { Plano } from "../models/Plano.js";
import { Op } from "sequelize";
import { Fidelidade } from "../models/Fidelidade.js";
import { CheckIn } from "../models/CheckIn.js";
import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';


class AssinaturaService {

  static async findAll() {
    return await Assinatura.findAll();
  }

  static async findByPk(req) {
    const { id } = req.params;
    return await Assinatura.findByPk(id);
  }


  static async verificarRegrasDeNegocio({ cliente_id }) {
  // Regra 1: não pode haver mais de uma assinatura ativa para um mesmi cliente
  const assinaturaAtiva = await Assinatura.findOne({
    where: {
      cliente_id,
      expires_at: { [Op.gt]: new Date() }
    }
  });
  if (assinaturaAtiva) {
    return {
      valido: false,
      mensagem: "Já existe uma assinatura ativa para este cliente"
    };
  }
  // Regra 2: Conceder 50% de desconto para clientes que tenham 12 meses consecutivos de fidelidade
  const ultimoCiclo = await Fidelidade.findOne({
    where: { cliente_id },
    order: [['data_fim', 'DESC']]
  });
  const now = new Date();
  const inicioWindow = ultimoCiclo
    ? new Date(ultimoCiclo.data_fim)
    : new Date(now.getFullYear(), now.getMonth() - 11, 1);

  // Busca todas as assinaturas do cliente dentro da janela de 12 meses
  const assinaturas = await Assinatura.findAll({
    where: {
      cliente_id,
      createdAt: { [Op.gte]: inicioWindow }
    }
  });

  // Mapeia os meses efetivamente pagos
  const mesesPresentes = new Set(
    assinaturas.map(a => {
      const d = a.createdAt;
      return `${d.getFullYear()}-${d.getMonth()}`;
    })
  );
  // Inclui o mês corrente para somar o 12º mês
  mesesPresentes.add(`${now.getFullYear()}-${now.getMonth()}`);

  // Gera a lista de 12 meses consecutivos esperados 
  const mesesNecessarios = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return `${d.getFullYear()}-${d.getMonth()}`;
  });

  // Verifica se todos os meses estão presentes
  const tem12Consecutivos = mesesNecessarios.every(m => mesesPresentes.has(m));

  if (tem12Consecutivos) {
    // concede 50% e informa o período de fidelidade
    return {
      valido: true,
      desconto: 50,
      aplicarCicloFidelidade: true,
      periodoFidelidade: {
        inicio: new Date(now.getFullYear(), now.getMonth() - 11, 1),
        fim:   new Date(now.getFullYear(), now.getMonth(), 1)
      }
    };
  }

  // caso contrário, sem desconto extra
  return {
    valido: true,
    desconto: 0,
    aplicarCicloFidelidade: false,
    periodoFidelidade: null
  };
}



  static async create(req) {
    const { metodo_pagamento, cliente_id, plano_id, valor, desconto = 0 } = req.body;

    const regras = await this.verificarRegrasDeNegocio({ cliente_id });
    if (!regras.valido) {
      throw new Error(regras.mensagem);
    }

    const descontoFinal = desconto + (regras.desconto || 0);
    const valorFinal = valor * (1 - descontoFinal / 100);

    const novaAssinatura = await Assinatura.create({
      desconto: descontoFinal,
      metodo_pagamento,
      cliente_id,
      plano_id,
      valor: valorFinal
    });
    console.log(regras.aplicarCicloFidelidade, regras.periodoFidelidade)
    if (regras.aplicarCicloFidelidade && regras.periodoFidelidade) {
      await Fidelidade.create({
        cliente_id,
        data_inicio: regras.periodoFidelidade.inicio,
        data_fim: regras.periodoFidelidade.fim,
        beneficio_aplicado: regras.desconto
      });
    }

    return novaAssinatura;
  }

  static async update(req) {
    const { id } = req.params;
    const { createdAt, expires_at, desconto, metodo_pagamento, cliente_id, plano_id, valor } = req.body;

    const assinatura = await Assinatura.findOne({ where: { id } });
    if (!assinatura) throw new Error('Assinatura não encontrada!');

    const clienteExiste = await Cliente.findByPk(cliente_id);
    if (!clienteExiste) throw new Error("Cliente referenciado não encontrado!");

    const planoExiste = await Plano.findByPk(plano_id);
    if (!planoExiste) throw new Error("Plano referenciado não encontrado!");

    Object.assign(assinatura, {
      createdAt,
      expires_at,
      desconto,
      metodo_pagamento,
      cliente_id,
      plano_id,
      valor
    });

    return await assinatura.save();
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Assinatura.findByPk(id);
    if (!obj) throw new Error("Assinatura não encontrada.");
    if (obj.expires_at < new Date()) throw new Error("Não foi possivel deletar essa assinatura, pois ela esta expirada");
    await CheckIn.destroy({ where: { assinatura_id: id } });
    return await obj.destroy();
  }

  /* RF-38 | Assinaturas ativas (vencimento no futuro) */
  static async relatorioAtivas() {
    const hoje = new Date();

    const sql = `
      SELECT  c.nome       AS cliente,
              p.nome       AS plano,
              p.frequencia AS assinatura,
              a.expires_at  AS vencimento
      FROM    assinaturas a
        JOIN  clientes    c ON c.id = a.cliente_id
        JOIN  planos      p ON p.id = a.plano_id
      WHERE   a.expires_at >= :hoje
      ORDER BY a.expires_at;
    `;

    return sequelize.query(sql, {
      replacements : { hoje },
      type         : QueryTypes.SELECT,
    });
  }

  /* RF-39 | Assinaturas a vencer nos próximos 10 dias */
  static async relatorioVencimentoProximo(dias = 10) {
    if (isNaN(dias) || dias <= 0) {
      throw new Error('Parâmetro "dias" deve ser inteiro positivo.');
    }

    const hoje   = new Date();
    const limite = new Date();
    limite.setDate(limite.getDate() + dias);

    const sql = `
      SELECT  c.nome       AS cliente,
              p.nome       AS plano,
              p.frequencia AS assinatura,
              a.expires_at  AS vencimento
      FROM    assinaturas a
        JOIN  clientes    c ON c.id = a.cliente_id
        JOIN  planos      p ON p.id = a.plano_id
      WHERE   a.expires_at BETWEEN :hoje AND :limite
      ORDER BY a.expires_at;
    `;

    return sequelize.query(sql, {
      replacements : { hoje, limite },
      type         : QueryTypes.SELECT,
    });
  }
}

export { AssinaturaService };
