import express from 'express';
import {fetch} from './controller.js';
let router = express.Router();

router.get('/fetch',fetch);

module.exports = router;
