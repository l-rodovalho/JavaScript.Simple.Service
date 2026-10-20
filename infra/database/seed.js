import { dbPool } from './database.config.js';

let seed = 123456789;

function seededRandom() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const TOTAL_RECORDS = 100000;
const BATCH_SIZE = 5000;

async function executeSeed() {
    console.log(`Starting injection of ${TOTAL_RECORDS} records...`);

    for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
        const values = [];
        const placeholders = [];
        let paramIndex = 1;

        for (let j = 0; j < BATCH_SIZE; j++) {
            const globalIndex = i + j;

            const billsCount = Math.floor(seededRandom() * 6) + 1;
            const bills = Array.from({ length: billsCount }, (_, idx) => ({
                month: `2026-0${idx + 1}`,
                amount: Number((seededRandom() * 5000 + 100).toFixed(2)),
                paid: seededRandom() > 0.5
            }));

            const zipPrefix = String(10000 + (globalIndex % 89999));
            const zipSuffix = String(globalIndex % 1000).padStart(3, '0');
            const zipCode = `${zipPrefix}-${zipSuffix}`;

            const billingAddress = JSON.stringify({
                street: "Av. Paulista",
                number: String(globalIndex),
                city: "São Paulo",
                state: "SP",
                zipCode: zipCode,
                billingHistory: bills
            });

            values.push(
                `Cliente ${globalIndex}`,
                `cliente_${globalIndex}@email.com`,
                `${globalIndex.toString().padStart(11, '0')}`,
                'ENTERPRISE',
                Number((seededRandom() * 1000 * 3.14).toFixed(2)),
                billingAddress,
                true
            );

            // Build placeholders ($1, $2, $3, $4, $5, $6, $7)
            const rowPlaceholders = Array.from({ length: 7 }, () => `$${paramIndex++}`).join(', ');
            placeholders.push(`(${rowPlaceholders})`);
        }

        const query = `
            INSERT INTO cliente (
                nome, email, numero_documento, tipo_plano, saldo, endereco_cobranca, ativo
            ) VALUES ${placeholders.join(', ')}
        `;

        await dbPool.query(query, values);
        console.log(`Processed batch: ${i + BATCH_SIZE} / ${TOTAL_RECORDS}`);
    }

    console.log(`Seed completed`);
    process.exit(0);
}

executeSeed().catch(err => {
    console.error('Execution failed:', err);
    process.exit(1);
});