const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../../config/db")

const Users = sequelize.define("users", {
    id:{
        type: DataTypes.UUID, // You can use other data types for the primary key, such as STRING or INTEGER
        defaultValue: Sequelize.UUIDV4, // If using UUID, you can set a default value using Sequelize.UUIDV4
        allowNull: false,
        primaryKey: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty : true
        }
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty : true
    }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty : true
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty : true
    }
    },
    phoneNumber:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty : true
        }
    },
    birth:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty : true
        }
    },
    profile_picture:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty : true
        }
    },
    point:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty : true
        }
    }
})

module.exports = Users