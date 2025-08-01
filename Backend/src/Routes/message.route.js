const router = require('express').Router();
const { getAllUsers, getMessages, sendMessage, deleteMessage, updateMessage } = require('../controller.js/message.controller');
const {isauthenticated} = require('../middlewares/auth.middleware');

router.get('/users', isauthenticated, getAllUsers);
router.get('/:id', isauthenticated, getMessages);
router.post('/send/:id', isauthenticated, sendMessage);
router.delete('/messages/:id', isauthenticated, deleteMessage);
router.put('/messages/:id', isauthenticated, updateMessage);

module.exports = router;