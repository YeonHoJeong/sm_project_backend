import {connect, transaction} from '../db';

/*
* insertPostLike - 유저가 like 처리를 안한 post에 좋아요를 누를 때
* userId : 로그인 한 user의 id
* postId : 유저가 누른 post의 id
* 해당 쿼리 결과는 db exception이 뜨면 false, 그것이 아니라면 true
* */


export const insertPostLike = connect(async (con, req) => {
    let userId = req.body.userId; // userID
    let postId = req.body.postId; // postID

    let query = "INSERT INTO `like` " +
        "(post_id, user_id) VALUES (?, ?); "; // 쿼리문 작성시 맨 뒤에 공백 넣어줄 것
    try{
        const result = await con.query(query, [postId, userId]);
        console.log(result);
    } catch(e){
        return false;
    }

    return true;

});
/*
* deletePostLike - 유저가 좋아요 처리 된 포스트에 다시 좋아요를 눌러서 취소할 때
* userId : 로그인 한 user의 id
* postId : 유저가 누른 post의 id
* 해당 쿼리 결과는 db exception이 뜨면 false, 그것이 아니라면 true
* */
export const deletePostLike = connect(async (con, req) => {
    let userId = req.body.userId;
    let postId = req.body.postId;

    let query = "DELETE FROM `like` " +
        "WHERE `like`.post_id = ? AND `like`.user_id = ?; ";
    try{
        const result = await con.query(query, [postId, userId]);
        console.log(result);
    } catch(e){
        return false;
    }
    return true;
});

/*
* getTagList - 모든 태그의 리스트들 넘김
* 원래 이러면 안되지만,, 일단.
 */

export const getTagList = connect(async (con, req) => {
    let query = "SELECT id, type, contents FROM tag; ";
    const result = await con.query(query, []);
    console.log(result);
    return result

});