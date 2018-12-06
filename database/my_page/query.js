import {connect, transaction} from '../db';
import {uploadS3} from'../../lib/upload';

export const getLikedList = connect(async(con, req) => {
    let userId = req.query.user_id;
    let query = "SELECT post.id as postId, post.title, postAttachment.url, (SELECT COUNT(*) FROM `like` WHERE `like`.post_id = post.id ) as likeCount, " +
        "IF (`like`.user_id = ?, TRUE, FALSE) as selectLike, postAttachment.version, post.updated_time " +
        "FROM post " +
        "LEFT JOIN `like` ON post.id = `like`.post_id AND `like`.user_id = ? " +
        "LEFT JOIN postAttachment ON post.id = postAttachment.post_id " +
        "WHERE postAttachment.type = 0  " +
        "AND postAttachment.version = (SELECT MAX(version) FROM postAttachment WHERE postAttachment.post_id = post.id) " +
        "AND `like`.user_id = ? " +
        "GROUP BY post.id, postAttachment.url, `like`.user_id,postAttachment.version ; "; // 쿼리문 작성시 맨 뒤에 공백 넣어줄 것
    const result = await con.query(query, [userId,userId,userId]);  //해당 결과는 변경이 되면 이상하므로 const.

    return result;

});

export const getMyPost = transaction(async(con, req) => {
    let userId = req.query.user_id;
    let query = "SELECT post.id as postId, post.title, postAttachment.url, (SELECT COUNT(*) FROM `like` WHERE `like`.post_id = post.id ) as likeCount, " +
        "IF (`like`.user_id = ?, TRUE, FALSE) as selectLike, postAttachment.version, post.updated_time " +
        "FROM post " +
        "LEFT JOIN `like` ON post.id = `like`.post_id AND `like`.user_id = ? " +
        "LEFT JOIN postAttachment ON post.id = postAttachment.post_id " +
        "WHERE postAttachment.type = 0  " +
        "AND postAttachment.version = (SELECT MAX(version) FROM postAttachment WHERE postAttachment.post_id = post.id) " +
        "AND `post`.user_id = ? " +
        "GROUP BY post.id, postAttachment.url, `like`.user_id,postAttachment.version ; "; // 쿼리문 작성시 맨 뒤에 공백 넣어줄 것
    const result = await con.query(query, [userId,userId,userId]);  //해당 결과는 변경이 되면 이상하므로 const.

    return result;


});