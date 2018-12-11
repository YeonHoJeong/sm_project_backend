import {getTagFeed, insertPostLike, deletePostLike} from '../../../database/tag_feed/query';

export const getFeed = async (req, res) => {
    let data = await getTagFeed(req);

    res.send(data);
};
