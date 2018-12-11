import {getPostDetailData, insertPostComment, commentSelectQuery} from '../../../database/detail_page/query';

export const getPostDetail = async(req, res) => {
    let data = await getPostDetailData(req);


    res.send(data);
};

export const insertComment = async(req, res) =>{
    let result = await insertPostComment(req);

    res.send(result);
};

export const commentSelect = async(req, res) =>{
  let result = await commentSelectQuery(req);

  res.send(result);
};