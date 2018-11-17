import {connect, transaction} from '../db';

export const fetchTotalFeed = connect(async (con) =>{
    let query = "SELECT post.id as post_id, post.title, COUNT(*) as like_count FROM post " +
        "LEFT JOIN `like` ON post.id = `like`.post_id " +
        "GROUP BY post.id; "; // 쿼리문 작성시 맨 뒤에 공백 넣어줄 것
    const result = await con.query(query, []);  //해당 결과는 변경이 되면 이상하므로 const.

    return result;
});
