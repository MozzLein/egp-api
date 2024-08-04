const express = require('express')
const router = express.Router()
const {userRegister, userLogin, getUserProfile, editUserProfile, adminRegister, adminLogin, clearQuest} = require('../controllers/userController')
const {villageRegister, villageList, villageAdminList, villageEdit, villageDelete} = require('../controllers/villageController')
const {addActivity, activityList, editActivity, deleteActivity} = require('../controllers/activityController')
const {addPackage, packageList, editPackage, deletePackage} = require('../controllers/packageController')
const {addQuest, questList, deleteQuest} = require('../controllers/questController')
const upload = require('../../config/multer')

//router get
router.get('/profile/:id', getUserProfile)
router.get('/homepage', villageList)
router.get('/homepage/:villageId/activity', activityList)
router.get('/homepage/package/:villageId', packageList)
router.get('/homepage/quest/:villageId', questList)

//router post
router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/quests/:questId/:id', upload.single('image'), clearQuest)

//router put
router.put('/profile/:id', upload.single('profile_picture'), editUserProfile)

//router admin ====================================================================================

//router get
router.get('/admin/:adminId/village', villageAdminList)

//router post
router.post('/admin/register', adminRegister)
router.post('/admin/login', adminLogin)
router.post('/admin/village/:adminId/register', upload.single('picture'), villageRegister)
router.post('/admin/:adminId/village/:villageId/activity', addActivity)
router.post('/admin/village/:villageId/package', upload.single('package_picture'), addPackage)
router.post('/admin/quest/:villageId', addQuest)

//router put
router.put('/admin/:adminId/village/:villageId', upload.single('picture'), villageEdit)
router.put('/admin/village/activity/:id', editActivity)
router.put('/admin/village/package/:packageId', upload.single('package_picture'), editPackage)

//router delete
router.delete('/admin/village/:id', villageDelete)
router.delete('/admin/village/activity/:id', deleteActivity)
router.delete('/admin/village/package/:packageId', deletePackage)
router.delete('/admin/quest/:questId', deleteQuest)
module.exports = router