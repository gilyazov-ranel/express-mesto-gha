const router = require('express').Router();
const {
  getUsers, getUserId, updateUser, updateAvatarUser, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserId);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
