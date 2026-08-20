export class HealthController {
    getHealth(req, res) {
        const response = { message: "OK" };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    }
}