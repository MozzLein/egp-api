const Activity = require('../models/activityModel.js')
const Village = require('../models/villageModel.js')
const {generateUUID} = require('../helper/generateId.js')
const {uploadStorage} = require('../helper/uploadStorage.js')

exports.addActivity = async (req, res) => {
    try {
        const villageId = req.params.villageId
        const { activityName, activityDesc, activityPrice, activity_picture } = req.body
        const id = generateUUID()

        //check if village exist
        const villageInformation = await Village.findOne({where: {id: villageId}})
        if(!villageInformation){
            res.status(404).send({
                message: "Village not found"
            })
            return
        }
    
        await uploadStorage(activity_picture, res, async (imageUrl) => {

            //Input data to DB
            await Activity.create({
                id,
                villageRelation: villageId,
                activityName,
                activityDesc,
                activityPrice,
                activity_picture : imageUrl || 'default.jpg'
            })
        
            res.status(201).send({
                message: "New activity added successfully"
            })
        })

    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.activityList = async (req, res) => {
    try {
        const villageId = req.params.villageId
        
        const activityList = await Activity.findAll({where: {id: villageId}})
        res.status(200).send({
            activityList
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.activityDetail = async (req, res) => {
    try {
        const activityId = req.params.activityId

        const activityDetail = await Activity.findOne({where: {id: activityId}})

        res.status(200).send({
            activityDetail
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.editActivity = async (req, res) => {
    try {
        const activityId = req.params.id

        //check if activity exist
        const activityInformation = await Activity.findOne({where: {id: activityId}})
        if(!activityInformation){
            res.status(404).send({
                message: "Activity not found"
            })
            return
        }
        
        const { activityName, activityDesc, activityPrice, activity_picture } = req.body
        
        await uploadStorage(activity_picture, res, async (imageUrl) => {
            
            //update activity
            const updateActivityInfo = Object.assign({}, activityInformation, {
                activityName,
                activityDesc,
                activityPrice,
                activity_picture : imageUrl || 'default.jpg'
            })

            await Activity.update(updateActivityInfo, {where: {id: activityId}})
            res.status(200).send({
                message: "Activity updated successfully"
            })
        })
        
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.deleteActivity = async (req, res) => {
    try {
        const activityId = req.params.id

        //check if activity exist
        const activityInformation = await Activity.findOne({where: {id: activityId}})
        if(!activityInformation){
            res.status(404).send({
                message: "Activity not found"
            })
            return
        }
        
        //delete activity
        await Activity.destroy({where: {id: activityId}})
        res.status(200).send({
            message: "Activity deleted successfully"
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}