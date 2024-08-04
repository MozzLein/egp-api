const Village = require('../models/villageModel.js')
const Activity = require('../models/activityModel.js')
const {generateUUID} = require('../helper/generateId.js')
const {uploadStorage} = require('../helper/uploadStorage.js')

exports.villageRegister = async (req, res) => {
    try {
        const { villageName, villageLatitude, villageLongitude, province, regency, district, socialMedia, contact} = req.body
        const picture = req.file
        const adminId = req.params.adminId
        const id = generateUUID()

        //check if file uploaded
        if (!picture) {
            return res.status(400).send({ message: 'No file uploaded' })
        }

        await uploadStorage (picture, res, async (imageUrl) => {

            // Input data to DB
            const newVillage = await Village.create({
                id,
                adminRelation: adminId,
                villageName,
                villageLatitude,
                villageLongitude,
                province,
                regency,
                district,
                socialMedia,
                contact,
                picture: imageUrl || 'default.jpg'
            })

            res.status(201).send({
                message: "New village added successfully",
                id: newVillage.id,
                newVillage
            })
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
            id: village.id,
            villageName: village.villageName,
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

exports.villageAdminList = async (req, res) => {
    try {
        const adminId = req.params.adminId

        //get all village
        const villages = await Village.findAll({
            include: [{
                model: Activity,
                as : 'activities',
                attributes : ['id', 'activityName', 'activityDesc', 'activityCategory']
            }]
        }, {
            where: {
                adminRelation: adminId
            }
        })

        //if there is no data
        if(villages.length < 1){
            res.status(404).send({
                message: "There is no data"
            })
            return
        }

        const villageData = villages.map(village => ({
            id: village.id,
            villageName: village.villageName,
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
        const {villageName, villageLatitude, villageLongitude, province, regency, district, socialMedia, contact} = req.body
        const picture = req.file

        await uploadStorage(picture, res, async (imageUrl) => {
            const updateVillageInfo = Object.assign({}, villageInformation, {
                villageName,
                villageLatitude,
                villageLongitude,
                province,
                regency,
                district,
                socialMedia,
                contact,
                picture : imageUrl
            })

            await Village.update(updateVillageInfo, {where: {id: villageId}})
            const updatedVillageInformation = await Village.findOne({where: {id: villageId}})

            res.status(200).send({
                message: "Village updated successfully",
                updatedVillageInformation
            })
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