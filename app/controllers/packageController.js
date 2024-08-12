const Package = require('../models/packageModel.js')
const Village = require('../models/villageModel.js')
const {uploadStorage} = require('../helper/uploadStorage.js')

exports.addPackage = async (req, res) => {
    try {
        const villageId = req.params.villageId
        const { name, description, price, duration } = req.body
        const package_picture = req.file

        //check if village exist
        const villageInformation = await Village.findOne({where: {id: villageId}})
        if(!villageInformation){
            res.status(404).send({
                message: "Village not found"
            })
            return
        }
        await uploadStorage (package_picture, res, async (imageUrl) => {

            //Input data to DB
            await Package.create({
                package_picture : imageUrl || 'default.jpg',
                name,
                description,
                villageRelation : villageId,
                price : 'Rp. ' + price,
                duration
            })
            res.status(201).send({
                message: "New package added successfully"
    
            })
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
}

exports.packageList = async (req, res) => {
    try {
        const {villageId} = req.params
        if(villageId){
            //get all package
            const packages = await Package.findAll({where: {villageRelation: villageId}})
            const {villageName} = await Village.findOne({where: {id: villageId}})
            return res.status(200).send({
                data: packages.map(packageData => ({
                    id: packageData.id,
                    packageName: packageData.name,
                    packageDesc: packageData.description,
                    packagePicture: packageData.package_picture,
                    packagePrice: packageData.price,
                    villageName
                }))
            })
        }
        //get all package
        const packages = await Package.findAll() 
        const {villageRelation} = packages
        const {villageName} = await Village.findOne({where: {id: villageRelation}})
        //if there is no data
        if(packages.length < 1){
            res.status(404).send({
                message: "There is no data"
            })
            return
        }
        
        //send data
        res.status(200).send({
            data: packages.map(packageData => ({
                id: packageData.id,
                packageName: packageData.name,
                packageDesc: packageData.description,
                packagePicture: packageData.package_picture,
                packagePrice: packageData.price,
                duration: packageData.duration,
                villageName
            }))
})
    } catch (error) {
        res.status(500).send({
            error: error.message
        }) 
    }
}

exports.packageAdminList = async (req, res) => {
    try {
        const {adminId} = req.params
        //get all package
        const villageRelation = await Village.findOne({ where: { adminRelation: adminId } });
        if(!villageRelation){
            res.status(404).send({
                message: "Village not found"
            })
            return
        }
        const packageList = await Package.findAll({where: {villageRelation : villageRelation.id}})

        res.status(200).send({
            villageRelation : villageRelation.id,
            packageList,
        })
    } catch (error) {
        res.status(500).send({
            
        })
    }
}

exports.packageDetail = async (req, res) => {
    try {
        const packageId = req.params.packageId

        //check if package exist
        const packageDetail = await Package.findOne({where: {id: packageId}})
        if(!packageDetail){
            res.status(404).send({
                message: "Package not found"
            })
            return
        }

        //get location data from vilalgeRelation
        const villageRelation = await Village.findOne({where: {id: packageDetail.villageRelation}})

        const {picture, villageName, villageLongitude, villageLatitude, province} = villageRelation

        res.status(200).send({
            packageDetail,
            picture,
            villageName,
            villageLongitude,
            villageLatitude,
            province
        })
    } catch (error) {
        res.send(500).send({
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

        const { name, description, price, duration } = req.body 
        const package_picture = req.file

        await uploadStorage (package_picture, res, async (imageUrl) => {

            //update package
            const updatePackageInfo = Object.assign({}, packageInformation, {
                package_picture : imageUrl || 'default.jpg',
                name,
                description,
                price : 'Rp. ' + price,
                duration
            })
            await Package.update(updatePackageInfo, {where: {id: packageId}})
            res.status(200).send({
                message: "Package updated successfully"
            })

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