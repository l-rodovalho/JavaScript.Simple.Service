export class HealthGrpcController {
    check(call, callback) {
        callback(null, {
            message: 'OK'
        });
    }
}