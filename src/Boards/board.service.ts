import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BoardEntity } from "./entity/board.entity";
import { PostBoardDto } from "./dto/postBoard.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { CashDetailEntity } from "src/Cashlists/entity/cashDetail.entity";
import { CashbookService } from "src/Cashlists/cashbook.service";
import { CashbookEntity } from "src/Cashlists/entity/cashbook.entity";

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardEntity)
        private boardRepository : Repository<BoardEntity>,
        //pirvate cashlistRepository :Repository<CashlistEntity>
        private readonly cashbookService : CashbookService
    ){}
    
    async postBoard(postBoardDto : PostBoardDto) : Promise<any> {
        if(!postBoardDto) {
            throw new Error('올바르지 않은 데이터입니다')
        }
        const query = this.boardRepository.create(
            postBoardDto
        )
        const result = await this.boardRepository.save(query)
        if(!result) {
            throw new Error('하나의 캐시북에 하나의 보드만 작성가능')
        }
        return result;
    } 

    async deleteByboardId(boardId : number) : Promise<any> {
        try {
            return this.boardRepository.createQueryBuilder()
            .delete()
            .where({boardId:boardId})
        } catch(e) {
            throw new Error('DB접속에러')
        }
        
    }

    async getListAll(paginationDTO : PaginationDto) : Promise<BoardEntity[]> {
        const result =  await this.boardRepository
        .createQueryBuilder('board')
        .leftJoin('board.cashbookId','cashbook')
        //.innerJoinAndSelect('cashbookId.cashbookId','cashdetail')
        .leftJoin('board.userId','user')
        .select(['board','cashbook','user.userNickname','user.userName'])
        .where('board.boardTypes=:boardTypes', {boardTypes:paginationDTO.boardTypes})
        .orderBy('board.boardCreatedAt',"DESC")
        .skip((paginationDTO.page-1)*paginationDTO.limit)
        .take(paginationDTO.limit)
        .getMany()

        console.log(result)
        return result;
    }

    async getBoardDetail(boardId : number) : Promise<BoardEntity> {
        return await this.boardRepository
        .createQueryBuilder('board')
        .leftJoin('board.userId','user')
        .leftJoin('board.comments','comment')
        .select(['board','comment','user.userId','user.userNickname','user.userName'])
        .where('board.boardId=:boardId',{boardId : boardId})
        .getOne()

    }

    async getDetailByBoardId(boardId : number) : Promise<CashbookEntity> {
        const boards = await this.boardRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect('board.cashbookId','cashbook')
        .where('board.boardId=:boardId',{boardId : boardId})
        .getOne()
        if(!boards) {
            throw new Error('매칭되는 데이터가 없습니다')
        }
        const cashbookId  = boards.cashbookId.cashbookId
        return await this.cashbookService.getcashbookAndDetail(cashbookId)
        
    }   

}