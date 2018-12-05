import {insertPostAndImg, versionUpPost} from '../../../database/upload_page/query';

export const uploadPost = async (req, res) => {
    let result = await insertPostAndImg(req);

    res.send(result);
};

export const versionUp = async (req, res) => {
    let result = await versionUpPost(req);

    res.send(result);
};