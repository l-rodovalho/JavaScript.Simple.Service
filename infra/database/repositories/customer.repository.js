import { dbPool } from '../database.config.js';

const FIND_BY_ID_SQL = 'SELECT cd_cliente, nome, endereco_cobranca FROM cliente WHERE cd_cliente = $1 AND ativo = true';

export class CustomerRepository {
    async findById(id) {
        const { rows } = await dbPool.query({ name: 'find-customer-by-id', text: FIND_BY_ID_SQL, values: [id] });

        const row = rows[0];
        if (!row) {
            return null;
        }

        const history = row.endereco_cobranca?.billingHistory;

        return {
            customerId: row.cd_cliente,
            name: row.nome,
            bills: Array.isArray(history) ? history : []
        };
    }
}