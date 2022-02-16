import * as express from 'express';
import User from './user.entity'
import {getRepository} from "typeorm";
import ApiError from '../error/ApiError'



class UserController {
    public path = '/users';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }
    private userRepository = getRepository(User)

    public intializeRoutes() {
        this.router.get(this.path, this.getAll);
        this.router.get(`/user`, this.findOne);
        this.router.post(this.path, this.create);
        this.router.post('/del', this.delete);
        this.router.post('/update', this.update);
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
        const id = req.params.id;
        if (id) {
            const oneUser = await this.userRepository.findOne(id)
            if (oneUser) {
                return res.json(oneUser)
            } else return ('no user with this Id: ' + id)
        } else return ('smth wrong: ' + req.body)

    }
    private delete = async  (req:express.Request, res:express.Response, next) => {
        const id = req.params.id;
        if (id){
            let userToRemove = await this.userRepository.findOne({id})
            const deleteResponse = await this.userRepository.remove(userToRemove)
            if (deleteResponse.raw[1]) {
                return ('user deleted, id:' + id)
            } else {
                next(ApiError.badRequest('can not find user with Id:' + id ))
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
        let {limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit

        const users = await this.userRepository.find();
        // const users = await connection.manager.findAndCount(UserEntiy,{take:limit, skip:offset});
        return res.json(users)
    }

}

export default UserController;
