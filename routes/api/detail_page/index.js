import express from 'express';
import {getPostDetail} from './controller.js';
let router = express.Router();

router.get('/get_post_detail', getPostDetail);

module.exports = router;
