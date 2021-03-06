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
    return result

});

/*
* insertUserData - 유저 데이터 INSERT
* 처음 스플래시 이후 로그인 페이지에서 입력 받고, 추가 하는 부분
*
 */
export const insertUserData = transaction(async (con, req) =>{

    let userData = req.body.userData;

    let query ="INSERT INTO user (type, name, email, phone) VALUES (?, ?, ?, ?); ";
    try {
        const result = await con.query(query, [0, userData.name, userData.email, userData.phone]);
    } catch(e){
        console.log(e);
        return false;
    }
    return true;

});

/*


 */

export const getUserDataQuery = connect(async (con, req) => {

    let phone = req.query.phone;

    let query = "SELECT id, name, email, phone " +
        "FROM user " +
        "WHERE phone = ? ";

    const result = await con.query(query, [phone]);

    return result;

});