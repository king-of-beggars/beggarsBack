import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BoardEntity } from "./entity/board.entity";

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardEntity)
        private boardRepository : Repository<BoardEntity>
        //pirvate cashlistRepository :Repository<CashlistEntity>
    ){}

    async getByCashlistId(cashbookId : number) : Promise<any> {
        cashbookId
    }

    async deleteByboardId(boardId : number) {

    }

    async getListGoodjob() {

    }

    async getListNoway() {

    }
    


}