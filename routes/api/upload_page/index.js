import express from 'express';
import {uploadPost, versionUp} from './controller.js';
import multer from 'multer';
let router = express.Router();

router.post('/upload_post',multer().any(),uploadPost);
router.post('/version_up', multer().any(), versionUp);

module.exports = router;
