import { HttpException, HttpStatus } from '@nestjs/common';
export class PaymentRequiredException extends HttpException {
    constructor(desc, code = 'Payment Required') {
        super(HttpException.createBody(desc ?? code, code, HttpStatus.PAYMENT_REQUIRED), HttpStatus.PAYMENT_REQUIRED);
    }
}
//# sourceMappingURL=payment-required.js.map