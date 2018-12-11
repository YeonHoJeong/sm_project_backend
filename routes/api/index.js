import express from 'express';
let router = express.Router();
import test from './test';
import common from'./common';
import total_feed from './total_feed';
import tag_feed from './tag_feed';
import detail_page from './detail_page';
import upload_page from './upload_page';
import my_page from './my_page';


router.use('/test', test);
router.use('/common', common);
router.use('/total_feed', total_feed);
router.use('/tag_feed', tag_feed);
router.use('/detail_page', detail_page);
router.use('/upload_page', upload_page);
router.use('/my_page', my_page);


module.exports = router;
