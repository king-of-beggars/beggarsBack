import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "./entity/board.entity";
import { PostBoardDto } from "./dto/postBoard.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { CashDetail } from "src/Cashlists/entity/cashDetail.entity";
import { CashbookService } from "src/Cashlists/cashbook.service";
import { Cashbook } from "src/Cashlists/entity/cashbook.entity";
import { GetByCashbookIdDto } from "src/Cashlists/dto/getByCashbookId.dto";
import { BoardResDto } from "./dto/boardRes.dto";
import { GetByBoardIdDto } from "./dto/getByBoardId.dto";

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository : Repository<Board>,
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

    async getListAll(paginationDTO : PaginationDto) : Promise<BoardResDto[]> {
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

        return result;
    }

    async getBoardDetail(getByBoardIdDto : GetByBoardIdDto) : Promise<Board> {
        return await this.boardRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect('board.userId','user')
        .leftJoinAndSelect('board.comments','comment')
        .leftJoinAndSelect('comment.userId','commentUser')
        .leftJoinAndSelect('comment.likes','like')
        .select(['board','comment','comment.userId','user.userId','user.userNickname','user.userName','commentUser.userId','commentUser.userName','commentUser.userNickname'])
        .where('board.boardId=:boardId',{boardId : getByBoardIdDto.boardId})
        .getOne()

    }

    async getDetailByBoardId(getByBoardIdDto : GetByBoardIdDto) : Promise<Cashbook> {
        const boards = await this.boardRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect('board.cashbookId','cashbook')
        .where('board.boardId=:boardId',{boardId : getByBoardIdDto.boardId})
        .getOne()
        const cashbookId : GetByCashbookIdDto = boards.cashbookId
        return await this.cashbookService.getcashbookAndDetail(cashbookId)
        
    }

    async BoardCheck(cashbookIds : number[]) {
        if(!cashbookIds) {
            throw new Error('날짜가 비어 있는 배열입니다')
        }
        
        const query = await this.boardRepository
        .createQueryBuilder('board')
        .select('boardId')
        .addSelect('cashbookId')
        .where('cashbookId IN (:...cashbookIds)',{cashbookIds})
        .getRawMany()
        const result = {}
        for(let i=0; query.length>i; i++) {
            result[query[i].cashbookId] = query[i].boardId 
        }

        return result;

    }

}