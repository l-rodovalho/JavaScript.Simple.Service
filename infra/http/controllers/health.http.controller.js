export class HealthHttpController {
    getHealth(request, reply) {
        const response = { message: "OK" };

        return reply.status(200).send(response);
    }
}
