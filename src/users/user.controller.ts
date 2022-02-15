import * as express from 'express';
import User from '../entity/User'
import {UserApiType} from "../controllers/userController";
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
        this.router.get('/:id', this.findOne);
        this.router.post(this.path, this.create);
        this.router.post('/update', this.delete);
        this.router.post('/del', this.update);
    }

    async create (req:express.Request, res:express.Response) {
        const {nickname} = req.body
        const user = new User();
        user.nickname = nickname;
        const createdUser =  await this.userRepository.save(user);
        return res.json(createdUser)
    }
    async findOne (req:express.Request, res:express.Response) {
        const {id}:UserApiType = req.body
        const oneUser = await this.userRepository.findOne({id})
        return res.json(oneUser)
    }
    async delete (req:express.Request, res:express.Response, next) {
        const {id}:UserApiType = req.body
        let userToRemove = await this.userRepository.findOne({id})
        await this.userRepository.remove(userToRemove)
        return next(ApiError.success('User deleted'))
    }
    async update (req:express.Request, res:express.Response) {
        const {id, nickname}:UserApiType = req.body
        let userToUpdate = await this.userRepository.findOne({id})
        userToUpdate.nickname = nickname;
        let updatedUser = await this.userRepository.save(userToUpdate)
        return res.json(updatedUser)
    }
    async getAll (req:express.Request, res:express.Response) {
        let {limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit

        const users = await connection.manager.findAndCount(User,{take:limit, skip:offset});
        return res.json(users)
    }

}

export default UserController;
