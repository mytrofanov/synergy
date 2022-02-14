import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Group} from "./Group";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nickname: string;

    @Column()
    created: string;

    @ManyToOne(type => Group, group => group.users)
    group: Group;

}
