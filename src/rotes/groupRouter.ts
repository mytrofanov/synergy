import * as express from 'express';
const router = express.Router();
const groupController = require('../controllers/groupController')

router.post('/',  groupController.create )
router.post('/del', groupController.delete )
router.post('/update', groupController.update )
router.get('/', groupController.getAll )
router.get('/group/:id', groupController.findOne )



module.exports = router