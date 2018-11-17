import express from 'express';
let router = express.Router();
import test from './test';
import total_feed from './total_feed';


router.use('/test', test);
router.use('/total_feed', total_feed);

module.exports = router;
