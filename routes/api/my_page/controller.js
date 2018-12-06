import {getLikedList, getMyPost} from '../../../database/my_page/query';

export const likedList = async (req, res) => {
    let data = await getLikedList(req);

    res.send(data);
};

export const myPost = async (req, res) => {
    let data = await getMyPost(req);

    res.send(data);
};