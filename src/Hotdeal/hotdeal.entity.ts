import { Column, Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
@Entity('HotDeal')
export class HotDeal {

    @PrimaryGeneratedColumn()
    public hotDealId : number;

    @Column()
    public hotDealTitle : string;

    @Column()
    public hotDealPrice : number;

    @Column()
    public hotDealLimit : number;

    @Column()
    public hotDealImg : string;

    @Column()
    public hotDealStartDate : Date;

    @Column()
    public hotDealEndDate : Date;


}