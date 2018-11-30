import express from 'express';
import { insertLike, deleteLike, getTag} from './controller.js';
let router = express.Router();

router.post('/insert_like',insertLike);
router.post('/delete_like',deleteLike);
router.get('/get_tag', getTag);

module.exports = router;
