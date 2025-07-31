const router = require('express').Router();
const { signup, signin, signout, getUser, updateProfile } = require('../controller.js/user.controller');
const { isauthenticated } = require('../middlewares/auth.middleware');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', isauthenticated ,signout);
router.get('/me', isauthenticated ,getUser);
router.put('/update-profile', isauthenticated ,updateProfile);

module.exports = router;