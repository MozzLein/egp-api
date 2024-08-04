const Package = require('../models/packageModel.js')
const Activity = require('../models/activityModel.js')
const Village = require('../models/villageModel.js')

exports.addPackage = async (req, res) => {
    try {
        const villageId = req.params.villageId
        const { package_picture, name, description, activities, price } = req.body

        //check if village exist
        const villageInformation = await Village.findOne({where: {id: villageId}})
        if(!villageInformation){
            res.status(404).send({
                message: "Village not found"
            })
            return
        }

        //Input data to DB
        await Package.create({
            package_picture : package_picture || 'default.jpg',
            name,
            description,
            villageRelation : villageId,
            activities,
            price : 'Rp. ' + price
        })
        res.status(201).send({
            message: "New package added successfully"

        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.packageList = async (req, res) => {
    try {
        const villageId = req.params.villageId
        //get all package
        const packages = await Package.findAll({where: {villageRelation : villageId}})  
        //if there is no data
        if(packages.length < 1){
            res.status(404).send({
                message: "There is no data"
            })
            return
        }

        const relatedVillage = await Village.findOne({where: {id: villageId}})
        const {villageName, villageLongitude, villageLatitude, socialMedia, contact} = relatedVillage
        
        //send data
        res.status(200).send({
            data: packages.map(packageData => ({
                packageName: packageData.name,
                packageDesc: packageData.description,
                packagePicture: packageData.package_picture,
                packagePrice: packageData.price,
                packageLongitude: villageLongitude,
                packageLatitude: villageLatitude,
                villageRelation: villageName,
                socialMedia,
                contact
            }))
})
    } catch (error) {
        res.status(500).send({
            error: error.message
        }) 
    }
}

exports.editPackage = async (req, res) => {
    try {
        const packageId = req.params.packageId
        //check if package exist
        const packageInformation = await Package.findOne({where: {id: packageId}})
        if(!packageInformation){
            res.status(404).send({
                message: "Package not found"
            })
            return
        }

        
        //update package
        const { package_picture, name, description, activities, price } = req.body 

        const updatePackageInfo = Object.assign({}, packageInformation, {
            package_picture : package_picture || 'default.jpg',
            name,
            description,
            activities,
            price : 'Rp. ' + price
        })
        await Package.update(updatePackageInfo, {where: {id: packageId}})
        res.status(200).send({
            message: "Package updated successfully"
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.deletePackage = async (req, res) => {
    try {
        const packageId = req.params.packageId
        
        //check if package exist
        const packageInformation = await Package.findOne({where: {id: packageId}})
        if(!packageInformation){
            res.status(404).send({
                message: "Package not found"
            })
            return
        }
        
        //delete package
        await Package.destroy({where: {id: packageId}})
        res.status(200).send({
            message: "Package deleted successfully"
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}