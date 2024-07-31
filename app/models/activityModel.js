const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require("../../config/db")

const Activity = sequelize.define("activities", {
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
    activityName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    activityDesc: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    activityCategory: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('activityCategory')
            return rawValue ? rawValue.split(';') : []
        },
        set(val) {
            this.setDataValue('activityCategory', Array.isArray(val) ? val.join(';') : val)
        },
    },
    activityPrice: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
})

module.exports = Activity