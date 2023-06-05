const router = require('express').Router();
const {
  getUsers, getUserId, updateUser, updateAvatarUser, getCurrentUser,
} = require('../controllers/users');
const {
  validationUserId, validationUpdateUser, validationUpdateAvatarUser,
} = require('../utilit/validateUser');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', validationUpdateUser, updateUser);
router.patch('/me/avatar', validationUpdateAvatarUser, updateAvatarUser);
router.get('/:userId', validationUserId, getUserId);

module.exports = router;
