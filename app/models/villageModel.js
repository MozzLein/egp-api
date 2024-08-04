const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require("../../config/db")
const Activity = require('../models/activityModel.js')
const Quest = require('../models/questModel.js')

const Village = sequelize.define("villages", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    adminRelation: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    villageName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    villageLatitude: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    villageLongitude: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    province: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    regency: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    socialMedia: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('socialMedia')
            return rawValue ? rawValue.split(';') : []
        },
        set(val) {
            this.setDataValue('socialMedia', Array.isArray(val) ? val.join(';') : val)
        },
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('contact')
            return rawValue ? rawValue.split(';') : []
        },
        set(val) {
            this.setDataValue('contact', Array.isArray(val) ? val.join(';') : val)
        },
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('picture')
            return rawValue ? rawValue.split(';') : []
        },
        set(val) {
            this.setDataValue('picture', Array.isArray(val) ? val.join(';') : val)
        },
    }
})

Village.hasMany(Activity, { foreignKey: 'villageRelation', as: 'packages'})
Village.hasMany(Activity, { foreignKey: 'villageRelation', as: 'activities' })
Village.hasMany(Quest, { foreignKey: 'villageRelation', as: 'quests' })

module.exports = Village
