import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Group} from "../groups/group.entity";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nickname: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

    @ManyToOne(type => Group, group => group.users)
    groupId: Group;


}

export default User
