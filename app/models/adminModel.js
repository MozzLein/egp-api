const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../../config/db")

const Admin = sequelize.define("admins", {
    id:{
        type: DataTypes.UUID, 
        defaultValue: Sequelize.UUIDV4,
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
    basedLocation:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty : true
        }
    }
})

module.exports = Admin