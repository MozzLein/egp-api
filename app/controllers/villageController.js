const Village = require('../models/villageModel.js')
const Activity = require('../models/activityModel.js')
const {generateUUID} = require('../helper/generateId.js')

exports.villageRegister = async (req, res) => {
    try {
        const { villageName, villageDesc, villageLatitude, villageLongitude, province, regency, district, socialMedia, contact, picture } = req.body
        const adminId = req.params.adminId
        const id = generateUUID()

        // Input data to DB
        await Village.create({
            id,
            adminRelation: adminId,
            villageName,
            villageDesc,
            villageLatitude,
            villageLongitude,
            province,
            regency,
            district,
            socialMedia: Array.isArray(socialMedia) ? socialMedia : [],
            contact: Array.isArray(contact) ? contact : [],
            picture: picture || 'default.jpg'
        })

        res.status(201).send({
            message: "New village added successfully"
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.villageList = async (req, res) => {
    try {
        //get all village
        const villages = await Village.findAll({
            include: [{
                model: Activity,
                as : 'activities',
                attributes : ['id', 'activityName', 'activityDesc', 'activityCategory']
            }]
        })

        //if there is no data
        if(villages.length < 1){
            res.status(404).send({
                message: "There is no data"
            })
            return
        }

        const villageData = villages.map(village => ({
            villageName: village.villageName,
            villageDesc: village.villageDesc,
            province: village.province,
            regency: village.regency,
            district: village.district,
            socialMedia: village.socialMedia,
            contact: village.contact,
            picture: village.picture,
            activities: village.activities.map(activity => ({
                id: activity.id,
                activityName: activity.activityName,
                activityDesc: activity.activityDesc,
                activityCategory: activity.activityCategory
            }))
        }));

        res.status(200).send({
            villageData
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.villageEdit = async (req, res) => {
    try {
        const villageId = req.params.villageId
        const adminId = req.params.adminId

        //check if village exist
        const villageInformation = await Village.findOne({where: {id: villageId}})
        if(!villageInformation){
            res.status(404).send({
                message: "Village not found"
            })
            return
        }

        //check if village and admin related
        if(villageInformation.adminRelation !== adminId){
            res.status(403).send({
                message: "You are not allowed to edit this village"
            })
            return
        }
        //update village information
        const {villageName, villageDesc, villageLatitude, villageLongitude, province, regency, district, socialMedia, contact, picture} = req.body
        const updateVillageInfo = Object.assign({}, villageInformation, {
            villageName,
            villageDesc,
            villageLatitude,
            villageLongitude,
            province,
            regency,
            district,
            socialMedia,
            contact,
            picture,
        })

        await Village.update(updateVillageInfo, {where: {id: villageId}})
        const updatedVillageInformation = await Village.findOne({where: {id: villageId}})

        res.status(200).send({
            message: "Village updated successfully",
            updatedVillageInformation
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.villageDelete = async (req, res) => {
    try {
        const villageId = req.params.id

        //check if village exist
        const villageInformation = await Village.findOne({where: {id: villageId}})
        if(!villageInformation){
            res.status(404).send({
                message: "Village not found"
            })
            return
        }

        //delete village
        await Village.destroy({where: {id: villageId}})
        res.status(200).send({
            message: "Village deleted successfully"
        })

    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}