import express from 'express';
import {getFeed} from './controller.js';

let router = express.Router();

router.get('/get_feed',getFeed);

module.exports = router;
