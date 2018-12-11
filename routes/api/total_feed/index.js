import express from 'express';
import {getFeed, getTop3} from './controller.js';
let router = express.Router();

router.get('/get_feed',getFeed);
router.get('/get_top3', getTop3);

module.exports = router;
