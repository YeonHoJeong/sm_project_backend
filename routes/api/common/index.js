import express from 'express';
import { insertLike, deleteLike} from './controller.js';
let router = express.Router();

router.post('/insert_like',insertLike);
router.post('/delete_like',deleteLike);

module.exports = router;
