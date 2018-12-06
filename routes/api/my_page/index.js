import express from 'express';
import {likedList, myPost} from './controller.js';

let router = express.Router();

router.get('/liked_list',likedList);
router.get('/my_post', myPost);

module.exports = router;
