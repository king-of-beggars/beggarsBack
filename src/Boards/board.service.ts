import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BoardEntity } from "./entity/board.entity";
import { PostBoardDto } from "./dto/postBoard.dto";
import { PaginationDto } from "./dto/pagination.dto";

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardEntity)
        private boardRepository : Repository<BoardEntity>
        //pirvate cashlistRepository :Repository<CashlistEntity>
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

    }

    async getListAll(paginationDTO : PaginationDto) {
        return await this.boardRepository
        .createQueryBuilder('board')
        .innerJoinAndSelect('board.cashbookId','cashbook')
        .where('board.boardTypes=:boardTypes', {boardTypes:paginationDTO.boardTypes})
        .skip((paginationDTO.page-1)*paginationDTO.limit)
        .take(paginationDTO.limit)
        .getMany()

    }
    


}