import {getTotalFeed, getTop3Post} from '../../../database/total_feed/query';

export const getFeed = async (req, res) => {
    let data = await getTotalFeed(req);

    res.send(data);
};


export const getTop3 = async (req, res) => {
    let data = await getTop3Post(req);

    res.send(data);

};