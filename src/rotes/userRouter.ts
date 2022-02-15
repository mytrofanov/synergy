import * as express from 'express';
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/',  userController.create )
router.post('/update',  userController.update )
router.post('/del',  userController.delete )
router.get('/', userController.getAll )
router.get('/:id', userController.findOne )


module.exports = router