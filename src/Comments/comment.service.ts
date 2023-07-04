import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Comment } from "./entity/comment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PostCommentDto } from "./dto/postComment.dto";
import User from "src/Users/user.entity";
import { UserService } from "src/Users/user.service";
import { EntityManager } from "typeorm";
import { Like } from "./entity/like.entity";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentEntity : Repository<Comment>,

        @InjectRepository(Like)
        private readonly likeEntity : Repository<Like>,
        
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

    async postLike(userId : User, commentId : Comment) {
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

    async getLike(commentId : Comment) {
        const result : number = await this.likeEntity
        .query(
            `SELECT count(*) FROM Like
            WHERE likeCheck=1
            AND WHERE commentId = ?`,[commentId]
        )
        return result
    }
}