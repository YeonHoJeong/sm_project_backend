import express from 'express';
import {uploadPost} from './controller.js';
let router = express.Router();

router.post('/upload_post',uploadPost);

module.exports = router;
