import {getTotalFeed, insertPostLike, deletePostLike} from '../../../database/total_feed/query';

export const getFeed = async (req, res) => {
    let data = await getTotalFeed(req);

    res.send(data);
};
