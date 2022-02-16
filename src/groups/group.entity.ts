import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {User} from "../users/user.entity";

@Entity()
export class Group {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("text")
    description: string;


    @OneToMany(type => User, user => user.groupId)
    users: User[];
}

export default Group
