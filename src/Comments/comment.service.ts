import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CommentEntity } from "./entity/comment.entity";

@Injectable()
export class CommentService {
    constructor(
        private readonly commentEntity : Repository<CommentEntity>
    ){}

    postComment() {
        
    }
    
}