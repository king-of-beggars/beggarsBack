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
    
    async postBoard(postBoardDto : PostBoardDto) {
        if(!postBoardDto) {
            throw new Error('올바르지 않은 데이터입니다')
        }
        const query = this.boardRepository.create(
            postBoardDto
        )
        this.boardRepository.save(query)
        .then((result)=>{return result})
        .catch((e)=>{
            throw new Error('한 게시글에 칭찬/싫어요를 2개 등록할 수 없습니다')
        })
    } 
    async deleteByboardId(boardId : number) {
        try {
            return this.boardRepository.createQueryBuilder()
            .delete()
            .where({boardId:boardId})
        } catch(e) {
            throw new Error('DB접속에러')
        }
        
    }

    async getListAll(paginationDTO : PaginationDto) {
        return await this.boardRepository
        .createQueryBuilder('board')
        .innerJoinAndSelect('board.cashbookId','cashbook')
        .where('board.boardTypes=:boardTypes', {boardTypes:paginationDTO.boardTypes})
        .orderBy('board.boardCreatedAt',"DESC")
        .skip((paginationDTO.page-1)*paginationDTO.limit)
        .take(paginationDTO.limit)
        .getMany()

    }

    async getBoardDetail(boardId : number) {
        return await this.boardRepository
        .createQueryBuilder('board')
        .leftJoin('board.userId','user')
        .leftJoin('board.comments','comment')
        .select(['board','comment','user.userId','user.userNickname','user.userName'])
        .where('board.boardId=:boardId',{boardId : boardId})
        .getOne()

    }

    async getDetailByBoardId(boardId : number) {
        const boards = await this.boardRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect('board.cashbookId','cashbook')
        .where('board.boardId=:boardId',{boardId : boardId})
        .getOne()
        const cashbookId  = boards.cashbookId.cashbookId
        return await this.cashbookService.getcashbookAndDetail(cashbookId)
        
    }
    


}