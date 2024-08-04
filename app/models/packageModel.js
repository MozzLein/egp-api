const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../../config/db")

const Package = sequelize.define("packages", {
    id:{
        type: DataTypes.UUID, 
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    package_picture:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty : true
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty : true
        }
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty : true
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
    price:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty : true
        }
    }
})

module.exports = Package