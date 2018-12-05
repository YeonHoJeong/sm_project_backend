import {connect, transaction} from '../db';

export const getPostDetailData = connect(async(con, req) => {
    const postId = req.query.postId;
    const userId = req.query.userId;
    const postVersion = Number(req.query.postVersion); // 만약 postVersion이 -1이거나 이러면 최신으로 가져오고, 그게 아니라면 해당하는 버전 줘야할듯
    //분리해서 생각해보자

    let maxPostVersionQs = "SELECT max(version) as maxVersion FROM postContents WHERE post_id = ?; "; //포스트 최대 몇 버전까지 있는지

    let userDataQs = "SELECT user.name, user.email, user.intro_text " +
        "FROM user " +
        "WHERE user.id = ?; ";

    let postDetailQs = "SELECT `post`.title, `postContents`.contents, `post`.updated_time, " +
        "(SELECT COUNT(*) FROM `like` WHERE `like`.post_id = post.id ) as likeCount, " +
        "IF (`like`.user_id = ?, TRUE, FALSE) as selectLike " +
        "FROM post " +
        "LEFT JOIN `postContents` ON `post`.id = `postContents`.post_id " +
        "LEFT JOIN `like` ON post.id = `like`.post_id AND `like`.user_id = ? " +
        "WHERE `post`.id = ? AND `postContents`.version = ? " +
        "GROUP BY `like`.user_id; "; // 포스트 상세내용 (contents도 조인걸고 같이)

    let postAttachmentQs = "SELECT `postAttachment`.post_id,`postAttachment`.url, `postAttachment`.type , `postAttachment`.version " +
        "FROM postAttachment " +
        "WHERE postAttachment.post_id = ? AND postAttachment.version = ?; "; //포스트 추가내용들

    let tagListQs = "SELECT `tag`.id, `tag`.type, `tag`.contents " +        // 태그리스트
        "FROM tagAttachment " +
        "LEFT JOIN `tag` ON `tag`.id = `tagAttachment`.tag_id " +
        "WHERE `tagAttachment`.post_id = ? ";

    let commentListQs = "SELECT `comment`.id, `comment`.post_id, `comment`.com_id, `comment`.contents, `comment`.selectType, `comment`.created_time " +
        "FROM `comment` " +
        "WHERE `comment`.post_id = ? "; // comment 리스트

    let commentAttachmentQs = "SELECT `commentAttachment`.comment_id, `commentAttachment`.url, `commentAttachment`.created_time " +
        "FROM `commentAttachment` " +
        "WHERE "; // comment들의 attachment들, commentList에서 comment id를 받아가지고 반복해서 binding


    const maxPostVersion = await con.query(maxPostVersionQs, [postId]);
    console.log(maxPostVersion);
    const userData = await con.query(userDataQs, [userId]);
    console.log(userData);

    const postDetail = await con.query(postDetailQs, [userId, userId, postId, postVersion === -1 ? maxPostVersion[0].maxVersion : postVersion]);
    console.log(postDetail);
    const postAttachment = await con.query(postAttachmentQs, [postId, postVersion === -1 ? maxPostVersion[0].maxVersion : postVersion]);
    console.log(postAttachment);
    const tagList = await con.query(tagListQs, [postId]);
    const commentList = await con.query(commentListQs, [postId]);
    console.log(commentList);

    let commentAttachment;
    if(commentList.length > 0){ //코멘트가 있어야함
        for(let i=0; i<commentList.length; i++){
            if(i !== commentList.length -1){
                commentAttachmentQs += "comment_id = " + commentList[i].comment_id + " AND ";
            } else if (i === commentList.length -1 ){
                commentAttachmentQs += "comment_id = " + commentList[i].comment_id;
            }
        }
         commentAttachment = await con.query(commentAttachmentQs, []);
    } else {
        commentAttachment = [];
    }

    let result = {
        maxPostVersion : maxPostVersion[0].maxVersion,
        userData : userData[0],
        postDetail : postDetail[0],
        postAttachment : postAttachment,
        tagList : tagList,
        commentList : commentList,
        commentAttachment : commentAttachment
    };

    return result;
});