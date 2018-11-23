import {getPostDetailData} from '../../../database/detail_page/query';

export const getPostDetail = async(req, res) => {
    let data = await getPostDetailData(req);


    res.send(data);
};