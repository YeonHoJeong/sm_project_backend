import express from 'express';
import {connectCall,transactionCall,imageUploadTest} from './controller.js';
import multer from 'multer';
let router = express.Router();

router.get('/con',connectCall);
router.get('/trans', transactionCall);
router.post('/img' ,multer().any(),imageUploadTest);

module.exports = router;
