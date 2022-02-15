const ApiError = require('../error/ApiError')
import {getConnection} from "typeorm";
import {User} from "../entity/User";
const connection = getConnection();

export type UserApiType = {
    id: number
    nickname: string
    created?:string
    group?: number
}
let date = new Date()
let dateYMD = date.toLocaleDateString ("fr-CA");

let userRepository = connection.getRepository(User)

class UserController {
    async create (req, res) {
        const {nickname} = req.body
        const user = new User();
        user.nickname = nickname;
        user.created = String(dateYMD)
        const createdUser =  await userRepository.save(user);
        return res.json(createdUser)
    }
    async findOne (req, res) {
        const {id}:UserApiType = req.body
        const oneUser = await userRepository.findOne({id})
        return res.json(oneUser)
    }
    async delete (req, res, next) {
        const {id}:UserApiType = req.body
        let userToRemove = await userRepository.findOne({id})
        await userRepository.remove(userToRemove)
        return next(ApiError.success('User deleted'))
    }
    async update (req, res) {
        const {id, nickname}:UserApiType = req.body
        let userToUpdate = await userRepository.findOne({id})
        userToUpdate.nickname = nickname;
        let updatedUser = await userRepository.save(userToUpdate)
        return res.json(updatedUser)
    }
    async getAll (req, res) {
        let {limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit

        const users = await connection.manager.findAndCount(User,{take:limit, skip:offset});
        return res.json(users)
    }

}

module.exports = new UserController()