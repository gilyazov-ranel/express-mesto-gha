const router = require('express').Router();
const {
  getUsers, getUserId, updateUser, updateAvatarUser, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatarUser);
router.get('/:userId', getUserId);

module.exports = router;
