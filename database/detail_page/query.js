import {connect, transaction} from '../db';

export const getPostDetailData = connect(async(con, req) => {
    const postId = req.query.postId;
    const userId = req.query.userId;
    const postVersion = req.query.postVersion; // 만약 postVersion이 -1이거나 이러면 최신으로 가져오고, 그게 아니라면 해당하는 버전 줘야할듯
    //생각해보니
    //(1)포스트 버전 리스트도 줘야함.
    //(2)코맨트 리스트
    //(3)디테일 데이터


    let query = "";
});