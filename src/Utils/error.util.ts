import { HttpException } from "@nestjs/common";



class ErrorUtil extends Error {
    constructor(
        stack?, message?, name?
    ){
        super();
        this.stack = stack,
        this.message = message,
        this.name = name

    }
    
}

export class UpdateFail extends ErrorUtil {
    
    
}

export class DeleteFail extends ErrorUtil {

}

export class ReadFail extends ErrorUtil {

}

export class CreateFail extends ErrorUtil {

}