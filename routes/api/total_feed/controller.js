import {getTotalFeed} from '../../../database/total_feed/query';

export const getFeed = async (req, res) => {
    let startSql = await getTotalFeed();

    res.send(startSql);
};
