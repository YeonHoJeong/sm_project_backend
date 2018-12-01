import express from 'express';
import {uploadPost} from './controller.js';
import multer from 'multer';
let router = express.Router();

router.post('/upload_post',multer().any(),uploadPost);

module.exports = router;
