import * as express from 'express';
import {getRepository} from "typeorm";
import {Group} from "../groups/group.entity";
import NotFoundException from "../exceptions/NotFoundException";
import HttpException from "../exceptions/HttpException";
import validationMiddleware from "../middleware/validation.middleware";
import CreateGroupDto from "./group.dto";
import IdGroupDto from "./idGroup.dto";
import User from "../users/user.entity";


class GroupController {
    public path = '/groups';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    private groupRepository = getRepository(Group)
    private userRepository = getRepository(User)

    public intializeRoutes() {
        this.router.get(this.path, this.getAll);
        this.router.get('/group', validationMiddleware(IdGroupDto), this.findOne);
        this.router.post('/update', validationMiddleware(CreateGroupDto), this.update);
        this.router.post('/del', validationMiddleware(IdGroupDto), this.delete);
        this.router.post('/create', validationMiddleware(CreateGroupDto), this.create);
    }

    private create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const {name, description} = req.body
        try {
            const group = new Group();
            group.name = name;
            group.description = description;
            const createdGroup = await this.groupRepository.save(group);
            return res.json(createdGroup)
        } catch (e) {
            next(new HttpException(404, e.message));
        }

    }
    private findOne = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const {id} = req.body
            if (id) {
                const oneGroup = await this.groupRepository.findOne({id})
                return res.json(oneGroup)
            } else {
                next(new NotFoundException(String(id)));
            }
        } catch (e) {
            next(new HttpException(404, e.message));
        }

    }
    private delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const {id} = req.body
            if (id) {
                const groupUsers = await this.userRepository.count({groupId:id});
                if (groupUsers > 0) {
                    return res.json('Group is not empty, it counts: ' + groupUsers + ' users!')
                }
                let groupToRemove = await this.groupRepository.findOne({id})
                await this.groupRepository.remove(groupToRemove)
                return res.json('deleted: ' + groupToRemove.name)

            } else {
                next(new NotFoundException(String(id)));
            }
        } catch (e) {
            next(new HttpException(404, e.message));
        }


    }
    private update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const {id, name, description} = req.body
        try {
            if (id) {
                let groupToUpdate = await this.groupRepository.findOne({id})
                groupToUpdate.name = name;
                groupToUpdate.description = description;
                let updatedGroup = await this.groupRepository.save(groupToUpdate)
                return res.json(updatedGroup)
            } else {
                next(new NotFoundException(String(id)));
            }

        } catch (e) {
            next(new HttpException(404, e.message));
        }


    }
    private getAll = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const groups = await this.groupRepository.find();
            return res.json(groups)
        } catch (e) {
            next(new HttpException(404, e.message));
        }
    }

}

export default GroupController;
