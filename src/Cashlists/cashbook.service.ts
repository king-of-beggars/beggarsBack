import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CashDetailEntity } from "./entity/cashDetail.entity";
import { CashbookEntity } from "./entity/cashbook.entity";
@Injectable()
export class CashbookService {
    constructor(
        private readonly cashDetailEntity : Repository<CashDetailEntity>
    ){}

    getDetailByCashbookId(cashbookId : number){
        this.cashDetailEntity.findOne({
            // where : {'cashbookId':cashbookId}
        })

    }


}