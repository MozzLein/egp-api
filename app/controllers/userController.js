const bcrypt = require('bcrypt')
const Users = require('../models/userModel.js')
const Admin = require('../models/adminModel.js')
const Quests = require('../models/questModel.js')
const jwt = require('jsonwebtoken')
const {generateUUID} = require('../helper/generateId.js')
const {uploadStorage} = require('../helper/uploadStorage.js')
require('dotenv').config()

//user section
exports.userRegister = async (req, res) => {
    try {
        //get data from user
        const {username, password, confirmPassword, email, firstName, lastName, phoneNumber, birth} = req.body
        
        //check if username exist
        const checkAdminUsername = await Admin.findOne({where :{username}})
        const checkUsername = await Users.findOne({where :{username}})
        if(checkAdminUsername || checkUsername){
            res.status(400).send({
                message: "Username already used!"
            })
            return
        }

        //check if password not match
        if(password !== confirmPassword){
            res.status(400).send({
                message : "Password not match"
            })
            return
        }

        //create hashed password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const id = generateUUID();

        //input data to db
        const name = `${firstName} ${lastName}`
        await Users.create({id, name, username, password : hashedPassword, email, phoneNumber, birth, profile_picture : 'default.jpg', point : 0})
        res.status(201).send({
            message: "New user added successfully"
        })
    } catch (error) {
        res.status(500).send({
            error : error.message
        })
    }
}

exports.userLogin = async (req, res) => {
    try {
        const {username, password} = req.body
        
        //check if username exist
        const userInformation = await Users.findOne({where: {username}})
        if(!userInformation){
            res.status(404).send({
                message: "User not found"
            })
            return
        }

        //check if the password match with password in db
        const isPasswordMatch = await bcrypt.compare(password, userInformation.password)
        if(!isPasswordMatch){
            res.status(401).send({
                message : "Wrong username or password!"
            })
            return
        }

        //set token for user
        const token = jwt.sign({user : {id: userInformation.id, name: userInformation.name}}, process.env.ACCESS_SECRET_KEY, {expiresIn: '10m'})
        
        res.status(200).send({
            message: "Login successfully",
            token: token,
            userId : userInformation.id
        })
    } catch (error) {
        res.status(500).send({
            error : error.message
        })
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id

        //check if user exist
        const userProfile = await Users.findOne({where: {id: userId}})
        if(!userProfile){
            res.status(404).send({
                message : "User not found"  
            })
            return
        }

        //send user profile 
        res.status(200).send({
            message : "User profile",
            id : userProfile.id,
            profile_picture : userProfile.profile_picture,
            name : userProfile.name,
            email : userProfile.email,
            phoneNumber : userProfile.phoneNumber,
            birth : userProfile.birth,
            point : userProfile.point
        })
    } catch (error) {
        res.status(500).send({
            error : error.message
        })
    }
}

exports.editUserProfile = async (req, res) => {
    try {
        const userId = req.params.id
        const {firstName, lastName, email, phoneNumber, birth} = req.body
        const profile_picture = req.file

        //check if file uploaded
        if (!profile_picture) {
            return res.status(400).send({ message: 'No file uploaded' })
        }
        
        //check if user exist
        const userProfile = await Users.findOne({where: {id: userId}})
        if(!userProfile){
            res.status(404).send({
                message : "User not found"  
            })
            return
        }

        if(userId !== userProfile.id){
            res.status(403).send({
                forbidden : "You do not have permission to edit this user data"
            })
            return
        }
        
        //upload profile picture to storage
        await uploadStorage(profile_picture, res, async (imageUrl) => {
            //edit user profile
            const updateUserInfo = Object.assign({}, userProfile, {
                firstName,
                lastName, 
                email,
                phoneNumber,
                birth,
                profile_picture : imageUrl
            })
            await Users.update(updateUserInfo, {where: {id: userId}})
            const updatedUserProfile = await Users.findOne({where: {id: userId}})
            //send user profile
            res.status(200).send({
                message: "User profile updated successfully",
                profile_picture : updatedUserProfile.profile_picture,
                name : updatedUserProfile.name,
                email : updatedUserProfile.email,
                phoneNumber : updatedUserProfile.phoneNumber,
                birth : updatedUserProfile.birth,
            })
        })

        
    } catch (error) {
        res.status(500).send({
            error : error.message
        })
    }
}

//admin section
exports.adminRegister = async (req, res) => {
    try {
        //get data from user
        const {username, password, confirmPassword, email, firstName, lastName, phoneNumber, birth, basedLocation} = req.body
        
        //check if username exist
        const checkAdminUsername = await Admin.findOne({where :{username}})
        const checkUsername = await Users.findOne({where :{username}})
        if(checkAdminUsername || checkUsername){
            res.status(400).send({
                message: "Username already used!"
            })
            return
        }

        //check if password not match
        if(password !== confirmPassword){
            res.status(400).send({
                message : "Password not match"
            })
            return
        }

        //create hashed password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const id = generateUUID();

        //input data to db
        const name = `${firstName} ${lastName}`
        await Admin.create({id, name, username, password : hashedPassword, email, phoneNumber, birth, profile_picture : 'default.jpg', basedLocation})
        res.status(201).send({
            message: "New user added successfully"
        })
    } catch (error) {
        res.status(500).send({
            error : error.message
        })
    }
}

exports.adminLogin = async (req, res) => {
    try {
        const {username, password} = req.body
        
        //check if username exist
        const adminInformation = await Admin.findOne({where: {username}})
        if(!adminInformation){
            res.status(404).send({
                message: "User not found"
            })
            return
        }

        //check if the password match with password in db
        const isPasswordMatch = await bcrypt.compare(password, adminInformation.password)
        if(!isPasswordMatch){
            res.status(401).send({
                message : "Wrong username or password!"
            })
            return
        }

        //set token for user
        const token = jwt.sign({user : {id: adminInformation.id, name: adminInformation.name}}, process.env.ACCESS_SECRET_KEY, {expiresIn: '10m'})
        
        res.status(200).send({
            message: "Login successfully",
            token: token
        })
    } catch (error) {
        res.status(500).send({
            error : error.message
        })
    }
}

exports.clearQuest = async (req, res) => {
    try {
        const file = req.file
        const {questId, id} = req.params

        if (!file) {
            return res.status(400).send({ message: 'No file uploaded' })
        }

        // Uploading file to storage
        await uploadStorage(file, res, async (imageUrl) => {
            try {
                // get quest point
                const questPoint = await Quests.findOne({where: {id: questId}})
                const point = questPoint.point

                // update user point
                const userPoint = await Users.findOne({where: {id: id}})
                const newPoint = userPoint.point + point

                await Users.update({point: newPoint},{where: {id: id}})

                res.status(200).send({
                    message: 'Upload success',
                    imageUrl
                })

            }catch(error) {
                res.status(500).send({
                    error: error.message
                })
            }
        })
        

    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}
