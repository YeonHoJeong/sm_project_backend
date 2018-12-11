import express from 'express';
import {getPostDetail, insertComment, commentSelect} from './controller.js';
import multer from 'multer';
let router = express.Router();

router.get('/get_post_detail', getPostDetail);
router.post('/insert_comment',multer().any(), insertComment);
router.post('/comment_select',commentSelect);

module.exports = router;
