const express = require('express')
const router = express.Router()
const {userRegister, userLogin, getUserProfile, editUserProfile, adminRegister, adminLogin, clearQuest} = require('../controllers/userController')
const {villageRegister, villageList, villageEdit, villageDelete} = require('../controllers/villageController')
const {addActivity, activityList, editActivity, deleteActivity} = require('../controllers/activityController')
const {addPackage, packageList, editPackage, deletePackage} = require('../controllers/packageController')
const {addQuest, questList, deleteQuest} = require('../controllers/questController')
const {verifyToken} = require("../middleware/authMiddleware")
const upload = require('../../config/multer')

//router get
router.get('/profile/:id', verifyToken, getUserProfile)
router.get('/homepage/village/activity', verifyToken, activityList)
router.get('/homepage/package/:villageId', verifyToken, packageList)
router.get('/homepage/quest/:villageId', verifyToken, questList)

//router post
router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/quests/:questId/:id', upload.single('image'), clearQuest)
//router put
router.put('/profile/:id', verifyToken, editUserProfile)

//router admin ====================================================================================

//router get
router.get('/admin/:adminId/village', verifyToken, villageList)

//router post
router.post('/admin/register', adminRegister)
router.post('/admin/login', adminLogin)
router.post('/admin/village/:adminId/register', verifyToken, villageRegister)
router.post('/admin/:adminId/village/:villageId/activity', verifyToken, addActivity)
router.post('/admin/village/:villageId/package', verifyToken, addPackage)
router.post('/admin/quest/:villageId', verifyToken, addQuest)

//router put
router.put('/admin/:adminId/village/:villageId', verifyToken, villageEdit)
router.put('/admin/village/activity/:id', verifyToken, editActivity)
router.put('/admin/village/package/:packageId', verifyToken, editPackage)

//router delete
router.delete('/admin/village/:id', verifyToken, villageDelete)
router.delete('/admin/village/activity/:id', verifyToken, deleteActivity)
router.delete('/admin/village/package/:packageId', verifyToken, deletePackage)
router.delete('/admin/quest/:questId', verifyToken, deleteQuest)
module.exports = router