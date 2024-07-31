const Quest = require('../models/questModel.js')
const {generateUUID} = require('../helper/generateId.js')

exports.addQuest = async (req, res) => {
    try {
        const villageId = req.params.villageId
        const { questName, questDesc, questLocation, point } = req.body
        const id = generateUUID()

        //Input data to DB
        await Quest.create({
            id,
            villageRelation: villageId,
            questName,
            questDesc,
            questLocation,
            point
        })

        res.status(201).send({
            message: "New quest added successfully"
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.questList = async (req, res) => {
    try {
        const villageId = req.params.villageId
        const questList = await Quest.findAll({where: {villageRelation: villageId}})
        res.status(200).send({
            questList
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.deleteQuest = async (req, res) => {
    try {
        const questId = req.params.questId
        await Quest.destroy({where: {id: questId}})
        res.status(200).send({
            message: "Quest deleted successfully"
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}