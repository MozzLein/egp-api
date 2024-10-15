const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require("../../config/db")

const Transaction = sequelize.define("transactions", {
    id: {
        type: DataTypes.UUID, 
        defaultValue: Sequelize.UUIDV4, 
        allowNull: false,
        primaryKey: true,
    },
    userId : {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    totalPax: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    item: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    villageRelation: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'villages',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    nik: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    transferProof: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    totalPrice: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    verification: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})

module.exports = Transaction