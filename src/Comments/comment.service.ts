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

    async postComment(postCommentDto : PostCommentDto, userId : number) {
        this.entityManager.transaction(async (manager)=> {

        })

        const query = this.commentEntity.create(
            postCommentDto
        )
        await this.userService.pointInput(userId,1)
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

    async postLike(userId : UserEntity, commentId : CommentEntity) {
        let query = await this.likeEntity
        .createQueryBuilder('like')
        .select()
        .where('like.userId=:userId',{userId})
        .andWhere('like.commentId',{commentId})
        .getOne()
        if(!query) {
            query = this.likeEntity.create({
                userId : userId,
                commentId : commentId
            })
        } else {
            query.likeCheck===1 ? query.likeCheck = 0 : query.likeCheck = 1  
        }
        return this.likeEntity.save(query)

    }
}