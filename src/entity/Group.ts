import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {User} from "./User";

@Entity()
export class Group {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("text")
    description: string;


    @OneToMany(type => User, user => user.group)
    users: User[];
}
