import {Group} from "../entity/Group";

const ApiError = require('../error/ApiError')
import {getConnection} from "typeorm";
const connection = getConnection();

export type GroupApiType = {
    id: number
    name: string
    description?: string
}
let groupRepository = connection.getRepository(Group)

class GroupController {


    async create (req, res) {
        const {name, description} = req.body
        const group = new Group();
        group.name = name;
        group.description = description;
        const createdGroup =  await groupRepository.save(group);
        return res.json(createdGroup)
    }
    async findOne (req, res) {
        const {id}:GroupApiType = req.body
        const oneGroup = await groupRepository.findOne({id})
        return res.json(oneGroup)
    }
    async delete (req, res, next) {
        const {id}:GroupApiType = req.body
        let groupToRemove = await groupRepository.findOne({id})
        await groupRepository.remove(groupToRemove)
        return next(ApiError.success('Group deleted'))
    }
    async update (req, res) {
        const {id, name, description}:GroupApiType = req.body
        let groupToUpdate = await groupRepository.findOne({id})
        groupToUpdate.name = name;
        groupToUpdate.description = description;
        let updatedGroup = await groupRepository.save(groupToUpdate)
        return res.json(updatedGroup)
    }
    async getAll (req, res) {
        const groups = await connection.manager.findAndCount(Group);
        return res.json(groups)
    }

}

module.exports = new GroupController()