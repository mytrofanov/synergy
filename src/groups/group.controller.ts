import * as express from 'express';
import {getRepository} from "typeorm";
import ApiError from '../error/ApiError'
import {Group} from "../groups/group.entity";



class GroupController {
    public path = '/groups';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }
    private groupRepository = getRepository(Group)

    public intializeRoutes() {
        this.router.get(this.path, this.getAll);
        this.router.get('/group', this.findOne);
        this.router.post('/update', this.update);
        this.router.post('/del', this.delete);
        this.router.post('/create', this.create);
    }

    private create =  async  (req, res) => {
        const {name, description} = req.body
        const group = new Group();
        group.name = name;
        group.description = description;
        const createdGroup =  await this.groupRepository.save(group);
        return res.json(createdGroup)
    }
    private findOne = async  (req, res) => {
        const {id} = req.body
        const oneGroup = await this.groupRepository.findOne({id})
        return res.json(oneGroup)
    }
    private delete = async  (req, res, next) => {
        const {id} = req.body
        let groupToRemove = await this.groupRepository.findOne({id})
        await this.groupRepository.remove(groupToRemove)
        return next(ApiError.success('Group deleted'))
    }
    private  update = async  (req, res) => {
        const {id, name, description} = req.body
        let groupToUpdate = await this.groupRepository.findOne({id})
        groupToUpdate.name = name;
        groupToUpdate.description = description;
        let updatedGroup = await this.groupRepository.save(groupToUpdate)
        return res.json(updatedGroup)
    }
    private getAll = async  (req, res) => {
        const groups = await this.groupRepository.find();
        return res.json(groups)
    }


}

export default GroupController;
