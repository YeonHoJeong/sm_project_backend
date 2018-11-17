import {fetchTotalFeed} from '../../../database/total_feed/query';

export const fetch = async (req, res) => {
    let startSql = await fetchTotalFeed();

    res.send(startSql);
};
