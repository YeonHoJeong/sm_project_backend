import {connect, transaction} from '../db';

/* result
* post_id : 포스트 아이디
* title : 포스트 타이틀
* url : 포스트 썸네일 url
* likeCount : 해당 포스트 전체 좋아요 갯수
* selectLike : 로그인 된 유저의 id 포스트 좋아요 여부
* */
export const getTagFeed = connect(async (con, req) =>{
    let userId = req.query.user_id;
    let tagList = req.query.tag_list;
    let baseQuery = "SELECT post.id as postId, post.title, postAttachment.url, (SELECT COUNT(*) FROM `like` WHERE `like`.post_id = post.id ) as likeCount, " +
        "IF (`like`.user_id = ?, TRUE, FALSE) as selectLike, postAttachment.version, post.updated_time " +
        "FROM post " +
        "LEFT JOIN `like` ON post.id = `like`.post_id AND `like`.user_id = ? " +
        "LEFT JOIN postAttachment ON post.id = postAttachment.post_id " +
        "LEFT JOIN `tagAttachment` ON post.id = `tagAttachment`.post_id " +
        "WHERE postAttachment.type = 0  AND postAttachment.version = (SELECT MAX(version) FROM postAttachment WHERE postAttachment.post_id = post.id) " ;

    let groupByQs = "GROUP BY post.id, postAttachment.url, `like`.user_id,postAttachment.version ; "; // GROUP BY 쿼리문, 맨 뒤에 붙임.
    let tagConditionalQs = "";
    if(tagList === undefined || tagList.length <= 0 ){  //조건 순서 바뀌면 에러남 ㅎ
        console.log("tagList is empty");
        return [];
    } else{
        tagConditionalQs += "AND (";
        for(let i=0; i<tagList.length; i++){
            tagConditionalQs += "tag_id = " + tagList[i];
            if(i !== tagList.length-1){
                tagConditionalQs += " OR ";
            }
        }
        tagConditionalQs += ") ";
    }

    baseQuery += tagConditionalQs + groupByQs;
    const result = await con.query(baseQuery, [userId, userId]);  //해당 결과는 변경이 되면 이상하므로 const.


    return result;
});

export const getTop3Post = connect(async (con, req) =>{




});
