const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require("../../config/db")

const Quest = sequelize.define("quests", {
    id: {
        type: DataTypes.UUID, 
        defaultValue: Sequelize.UUIDV4, 
        allowNull: false,
        primaryKey: true,
    },
    villageRelation: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'villages',
            key: 'id'
        }
    },
    questName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    questDesc: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    questLocation: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    point : {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})

module.exports = Quest