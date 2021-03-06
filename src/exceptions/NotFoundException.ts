import HttpException from "./HttpException";

class NotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Request with id ${id} not found`);
    }
}

export default NotFoundException;
