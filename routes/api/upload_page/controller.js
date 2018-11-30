import {insertPostAndImg} from '../../../database/upload_page/query';

export const uploadPost = async (req, res) => {
    let result = await insertPostAndImg(req);

    res.send(result);
};
