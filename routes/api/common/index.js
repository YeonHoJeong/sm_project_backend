import express from 'express';
import { insertLike, deleteLike, getUserData, getTag,insertUser} from './controller.js';
let router = express.Router();

router.post('/insert_like',insertLike);
router.post('/delete_like',deleteLike);
router.get('/get_user_data',getUserData);
router.get('/get_tag', getTag);
router.post('/insert_user', insertUser);

module.exports = router;
