import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CommentEntity } from "./entity/comment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PostCommentDto } from "./dto/postComment.dto";
import UserEntity from "src/Users/user.entity";
import { UserService } from "src/Users/user.service";
@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentEntity : Repository<CommentEntity>,
        
        private readonly userService : UserService
    ){}

    async postComment(postCommentDto : PostCommentDto) {

        const query = this.commentEntity.create(
            postCommentDto
        )
        await this.userService.pointInput(1)
        return await this.commentEntity.save(query);
        
    }
    
    async deleteComment() {

    }
}