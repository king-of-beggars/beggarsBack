import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CommentEntity } from "./entity/comment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PostCommentDto } from "./dto/postComment.dto";
import UserEntity from "src/Users/user.entity";
import { UserService } from "src/Users/user.service";
import { EntityManager } from "typeorm";
import { LikeEntity } from "./entity/like.entity";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentEntity : Repository<CommentEntity>,

        @InjectRepository(LikeEntity)
        private readonly likeEntity : Repository<LikeEntity>,
        
        private readonly userService : UserService,

        private readonly entityManager : EntityManager
    ){}

    async postComment(postCommentDto : PostCommentDto) {
        this.entityManager.transaction(async (manager)=> {

        })

        const query = this.commentEntity.create(
            postCommentDto
        )
        await this.userService.pointInput(1)
        return await this.commentEntity.save(query);
        
    }
    
    async deleteComment(commentId : number,userId : number) {
        return await this.commentEntity
        .createQueryBuilder('comment')
        .delete()
        .where('comment.commentId=:commentId',{commentId})
        .andWhere('comment.userId=:userId',{userId})
        .execute()


    }

    // async postLike(userId : UserEntity, commentId : CommentEntity) {
    //     this.likeEntity.create({
    //         userId : userId,
    //         commentId : commentId
    //     })

    // }
}