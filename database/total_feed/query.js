import {connect, transaction} from '../db';

/* result
* post_id : 포스트 아이디
* title : 포스트 타이틀
* url : 포스트 썸네일 url
* likeCount : 해당 포스트 전체 좋아요 갯수
* selectLike : 로그인 된 유저의 id 포스트 좋아요 여부
* */
export const getTotalFeed = connect(async (con, req) =>{
    let userId = req.query.user_id;
    let query = "SELECT post.id as postId, post.title, postAttachment.url, (SELECT COUNT(*) FROM `like` WHERE `like`.post_id = post.id ) as likeCount, " +
        "IF (`like`.user_id = 2, TRUE, FALSE) as selectLike, postAttachment.version " +
        "FROM post " +
        "LEFT JOIN `like` ON post.id = `like`.post_id AND `like`.user_id = ? " +
        "LEFT JOIN postVersion ON post.id = postVersion.post_id " +
        "LEFT JOIN postAttachment ON post.id = postAttachment.post_id " +
        "WHERE postAttachment.type = 0  AND postAttachment.version = (SELECT MAX(version) FROM postAttachment WHERE postAttachment.post_id = post.id) " +
        "GROUP BY post.id, postAttachment.url, `like`.user_id,postAttachment.version ; "; // 쿼리문 작성시 맨 뒤에 공백 넣어줄 것
    const result = await con.query(query, [userId, userId]);  //해당 결과는 변경이 되면 이상하므로 const.

    console.log(req);
    return result;
});


