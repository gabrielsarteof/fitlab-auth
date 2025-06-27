//Arthur
import { CheckIn } from '../models/CheckIn.js';
import { Assinatura } from '../models/Assinatura.js';
import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';

class CheckInService {
  static async findAll() {
    const objs = await CheckIn.findAll({
      include: { all: true, nested: true },
    });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await CheckIn.findByPk(id, {
      include: { all: true, nested: true },
    });
    return obj;
  }

  static async create(req) {
    const { assinatura_id, saida } = req.body;
    if (!assinatura_id) throw 'Campo assinatura_id é obrigatório.';

    // carrega assinatura + cliente + plano
    const assinatura = await Assinatura.findByPk(assinatura_id, {
      include: ['cliente', 'plano']
    });
    if (!assinatura) throw 'Assinatura não encontrada.';

    const cliente_id = assinatura.cliente_id;
    const plano      = assinatura.plano;            // objeto Plano com .frequencia
    const agora      = new Date();

    // verifica expiração
    let acesso_autorizado = true;
    let razao_bloqueio     = null;
    if (new Date(assinatura.expires_at) < agora) {
      acesso_autorizado = false;
      razao_bloqueio    = 'Assinatura expirada';
    }

    // RN1: só 1 check-in por dia
    await this.verificarRegrasDeNegocio({
      cliente_id,
      dataEntrada: agora,
      plano_frequencia: plano.frequencia
    });

    // grava com transaction
    const t = await sequelize.transaction();
    try {
      const obj = await CheckIn.create({
        assinatura_id,
        entrada:           agora,
        saida:             saida || null,
        acesso_autorizado,
        razao_bloqueio
      }, { transaction: t });

      await t.commit();
      return await CheckIn.findByPk(obj.id, { include: ['assinatura'] });
    } catch (err) {
      await t.rollback();
      throw 'Erro ao criar check-in!';
    }
  }

  static async verificarRegrasDeNegocio({ cliente_id, dataEntrada, plano_frequencia }) {
    // 1) Já fez check-in hoje?
    const di = await sequelize.query(
      `SELECT 1
         FROM checkins c
         JOIN assinaturas a ON c.assinatura_id = a.id
        WHERE a.cliente_id = :cliente_id
          AND DATE(c.entrada) = DATE(:dataEntrada)
        LIMIT 1`,
      { replacements: { cliente_id, dataEntrada }, type: QueryTypes.SELECT }
    );
    if (di.length) throw 'Cliente já fez check-in hoje!';

    // 2) Quantos na última semana?
    const umaSemanaAtras = new Date(dataEntrada);
    umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);

    const [{ total }] = await sequelize.query(
      `SELECT COUNT(*)::int AS total
         FROM checkins c
         JOIN assinaturas a ON c.assinatura_id = a.id
        WHERE a.cliente_id = :cliente_id
          AND c.entrada BETWEEN :umaSemanaAtras AND :dataEntrada`,
      { replacements: { cliente_id, umaSemanaAtras, dataEntrada }, type: QueryTypes.SELECT }
    );

    // 3) Extrai o número permitido do campo `frequencia`
    let limiteSemanal;
    const txt = plano_frequencia.toLowerCase();
    if (txt.includes('ilimit')) {
      limiteSemanal = Infinity;
    } else {
      const m = txt.match(/(\d+)/);
      limiteSemanal = m ? parseInt(m[1], 10) : 0;
    }

    if (limiteSemanal !== Infinity && total >= limiteSemanal) {
      throw `Limite semanal de ${limiteSemanal} check-ins atingido para este plano!`;
    }

    return true;
  }

  static async update(req) {
    const { id } = req.params;
    const { entrada, saida, acesso_autorizado, razao_bloqueio, cliente_id } = req.body;

    const obj = await CheckIn.findByPk(id, { include: { all: true, nested: true } });
    if (obj == null) throw 'CheckIn não encontrado!';

    const t = await sequelize.transaction();
    try {
      Object.assign(obj, {
        entrada: entrada || obj.entrada,
        saida: saida !== undefined ? saida : obj.saida,
        acesso_autorizado: acesso_autorizado !== undefined ? acesso_autorizado : obj.acesso_autorizado,
        razao_bloqueio: razao_bloqueio !== undefined ? razao_bloqueio : obj.razao_bloqueio,
        cliente_id: cliente_id || obj.cliente_id,
      });

      await obj.save({ transaction: t });
      await t.commit();
      return await CheckIn.findByPk(obj.id, { include: { all: true, nested: true } });
    } catch (error) {
      await t.rollback();
      throw "Erro ao atualizar checkin!";
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await CheckIn.findByPk(id);
    if (obj == null) throw 'CheckIn não encontrado!';

    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw "Não é possível remover este checkin!";
    }
  }

  

  static async findByCliente(req) {
    const { cliente_id } = req.params;
    const objs = await CheckIn.findAll({
      where: { cliente_id },
      order: [['entrada', 'DESC']],
      include: { all: true, nested: true },
    });
    return objs;
  }

  static async findAutorizados(req) {
    const { autorizado } = req.query;
    const objs = await CheckIn.findAll({
      where: { acesso_autorizado: autorizado === 'true' },
      include: { all: true, nested: true },
    });
    return objs;
  }

  static async getClientesNaAcademia() {
    const objs = await CheckIn.findAll({
      where: { saida: null },
      include: { all: true, nested: true },
    });
    return objs;
  }
}

export { CheckInService };