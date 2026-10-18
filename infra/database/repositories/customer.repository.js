import { dbPool } from '../database.config.js';

export class CustomerRepository {
    async findById(id) {
        const query = 'SELECT cd_cliente, nome, endereco_cobranca FROM cliente WHERE cd_cliente = $1 AND ativo = true';
        const { rows } = await dbPool.query(query, [id]);

        return rows[0] || null;
    }
}