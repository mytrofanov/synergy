import * as express from 'express';
import User from './user.entity'
import {getRepository} from "typeorm";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "./users.dto";
import NotFoundException from "../exceptions/NotFoundException";
import HttpException from "../exceptions/HttpException";


class UserController {
    public path = '/users';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }
    private userRepository = getRepository(User)

    public intializeRoutes() {
        this.router.get(this.path, this.getAll);
        this.router.get(`/users/user`, validationMiddleware(CreateUserDto), this.findOne);
        this.router.get(`/users/gusers`, validationMiddleware(CreateUserDto),this.getGruopUsers);
        this.router.post(this.path, validationMiddleware(CreateUserDto),this.create);
        this.router.post('/users/del', validationMiddleware(CreateUserDto), this.delete);
        this.router.post('/users/update', validationMiddleware(CreateUserDto),this.update);
    }

    private create =  async  (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const {nickname, groupId} = req.body
        try {
            if (nickname) {
                const user = new User();
                user.nickname = nickname;
                user.groupId = groupId;
                const createdUser =  await this.userRepository.save(user);
                return res.json(createdUser)
            } else {
                next(new NotFoundException(String(nickname)));
            }
        } catch (e) {
            next(new HttpException(404, e.message));
        }



    }
    private findOne =  async  (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const {id}= req.body
        try {
            if (id) {
                let oneUser = await this.userRepository.findOne({id})
                return res.json(oneUser)
            } else {
                next(new NotFoundException(String(id)));
            }
        } catch (e) {
            next(new HttpException(404, e.message));
        }



    }
    private delete = async  (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const {id}= req.params
        try {
            if (id){
                let userToRemove = await this.userRepository.findOne({id})
                const deleteResponse = await this.userRepository.remove(userToRemove)
                if (deleteResponse.nickname) {
                    return res.json('deleted: ' + deleteResponse.nickname)
                }
            } else {
                next(new NotFoundException(String(id)));
            }
        } catch (e) {
            next(new HttpException(404, e.message));
        }


    }
    private update = async  (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const {id, nickname,groupId} = req.body
        try {
            if (id) {
                let userToUpdate = await this.userRepository.findOne({id})
                if (userToUpdate){
                    userToUpdate.nickname = nickname;
                    userToUpdate.groupId = groupId;
                    let updatedUser = await this.userRepository.save(userToUpdate)
                    return res.json(updatedUser)
                }
            }else {
                next(new NotFoundException(String(id)));
            }
        }  catch (e) {
            next(new HttpException(404, e.message));
        }


    }
    private getAll = async  (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            // remove comments to work with pagination:
            // let {limit, page} = req.body
            // page = page || 1
            // limit = limit || 10
            // let offset = page * limit - limit
            const totalUsers = await this.userRepository.count();

            const users = await getRepository(User)
                .createQueryBuilder("Users")
                // .skip(offset)
                // .take(limit)
                .getMany();
            return res.json([users , {'totalUsers': totalUsers}])
        } catch (e) {
            next(new HttpException(404, e.message));
        }

    }

    private getGruopUsers = async  (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let {limit, page, groupId} = req.body
        try {
            if (groupId) {
                // remove comments to work with pagination:
                // page = page || 1
                // limit = limit || 9
                // let offset = page * limit - limit
                const groupUsers = await this.userRepository.count({groupId});

                const users = await getRepository(User)
                    .createQueryBuilder("Users")
                    .where({groupId})
                    // .skip(offset)
                    // .take(limit)
                    .getMany();
                // const users = await connection.manager.findAndCount(User,{take:limit, skip:offset});
                return res.json([users, {'groupUsers': groupUsers}])
            } else {
                next(new NotFoundException(String(groupId)));
            }

        } catch (e) {
            next(new HttpException(404, e.message));
        }
        }


}

export default UserController;
