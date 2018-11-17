import {connect, transaction} from '../db';

export const getTotalFeed = connect(async (con) =>{
    let query = "SELECT post.id as post_id, post.title, postAttachment.url, COUNT(*) FROM post " +
        "LEFT JOIN `like` ON post.id = `like`.post_id " +
        "LEFT JOIN postAttachment ON post.id = postAttachment.post_id " +
        "GROUP BY post.id, postAttachment.url; "; // 쿼리문 작성시 맨 뒤에 공백 넣어줄 것
    const result = await con.query(query, []);  //해당 결과는 변경이 되면 이상하므로 const.

    return result;
});
