import * as express from 'express';
import User from './user.entity'
import {getRepository} from "typeorm";


class UserController {
    public path = '/users';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }
    private userRepository = getRepository(User)

    public intializeRoutes() {
        this.router.get(this.path, this.getAll);
        this.router.get(`/users/user`, this.findOne);
        this.router.get(`/users/gusers`, this.getGruopUsers);
        this.router.post(this.path, this.create);
        this.router.post('/users/del', this.delete);
        this.router.post('/users/update', this.update);
    }

    private create =  async  (req:express.Request, res:express.Response) => {
        const {nickname, groupId} = req.body
        if (nickname) {
            const user = new User();
            user.nickname = nickname;
            user.groupId = groupId;
            const createdUser =  await this.userRepository.save(user);
            return res.json(createdUser)
        } else return  ('smth wrong: ' + req.body)


    }
    private findOne =  async  (req:express.Request, res:express.Response) => {
        const {id}= req.body
        if (id) {
            let oneUser = await this.userRepository.findOne({id})
            return res.json(oneUser)
        } else return ('smth wrong user who has Id: ' + id)

    }
    private delete = async  (req:express.Request, res:express.Response) => {
        const {id}= req.body
        if (id){
            let userToRemove = await this.userRepository.findOne({id})
            const deleteResponse = await this.userRepository.remove(userToRemove)
            if (deleteResponse.nickname) {
                return res.json('deleted: ' + deleteResponse.nickname)
            }
        } else return ('smth wrong: ' + req.body)

    }
    private update = async  (req:express.Request, res:express.Response) => {
        const {id, nickname,groupId} = req.body
        if (id) {
            let userToUpdate = await this.userRepository.findOne({id})
            if (userToUpdate){
                userToUpdate.nickname = nickname;
                userToUpdate.groupId = groupId;
                let updatedUser = await this.userRepository.save(userToUpdate)
                return res.json(updatedUser)
            }
        }

    }
    private getAll = async  (req:express.Request, res:express.Response) => {
        let {limit, page} = req.body
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        const totalUsers = await this.userRepository.count();

        const users = await getRepository(User)
            .createQueryBuilder("Users")
            .skip(offset)
            .take(limit)
            .getMany();
        // const users = await connection.manager.findAndCount(User,{take:limit, skip:offset});
        return res.json([users , {'totalUsers': totalUsers}])
    }

    private getGruopUsers = async  (req:express.Request, res:express.Response) => {
        let {limit, page, groupId} = req.body
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        const groupUsers = await this.userRepository.count({groupId});

        const users = await getRepository(User)
            .createQueryBuilder("Users")
            .where({groupId})
            .skip(offset)
            .take(limit)
            .getMany();
        // const users = await connection.manager.findAndCount(User,{take:limit, skip:offset});
        return res.json([users, {'groupUsers': groupUsers}])
    }

}

export default UserController;
