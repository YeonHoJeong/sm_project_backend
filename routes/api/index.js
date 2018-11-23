import express from 'express';
let router = express.Router();
import test from './test';
import common from'./common';
import total_feed from './total_feed';
import detail_page from './detail_page';


router.use('/test', test);
router.use('/common', common);
router.use('/total_feed', total_feed);
router.use('/detail_page', detail_page);


module.exports = router;
