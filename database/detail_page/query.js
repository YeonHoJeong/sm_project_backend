import {connect, transaction} from '../db';
import {uploadS3} from'../../lib/upload';
/*  getPostDetailData - 특정 포스트의 상세 페이지
 */
export const getPostDetailData = connect(async(con, req) => {
    const postId = req.query.postId;
    const userId = req.query.userId;
    const postVersion = Number(req.query.postVersion); // 만약 postVersion이 -1이거나 이러면 최신으로 가져오고, 그게 아니라면 해당하는 버전 줘야할듯
    //분리해서 생각해보자

    let maxPostVersionQs = "SELECT max(version) as maxVersion FROM postContents WHERE post_id = ?; "; //포스트 최대 몇 버전까지 있는지

    let userDataQs = "SELECT user.id, user.name, user.email, user.intro_text " +
        "FROM post " +
        "LEFT JOIN `user` ON user.id = post.user_id " +
        "WHERE post.id = ?; ";

    let postDetailQs = "SELECT `post`.id as post_id, `post`.title, `postContents`.contents, `post`.updated_time, " +
        "(SELECT COUNT(*) FROM `like` WHERE `like`.post_id = post.id ) as likeCount, " +
        "IF (`like`.user_id = ?, TRUE, FALSE) as selectLike " +
        "FROM post " +
        "LEFT JOIN `postContents` ON `post`.id = `postContents`.post_id " +
        "LEFT JOIN `like` ON post.id = `like`.post_id AND `like`.user_id = ? " +
        "WHERE `post`.id = ? AND `postContents`.version = ? " +
        "GROUP BY `like`.user_id; "; // 포스트 상세내용 (contents도 조인걸고 같이)

    let postAttachmentQs = "SELECT `postAttachment`.url, `postAttachment`.type , `postAttachment`.version " +
        "FROM postAttachment " +
        "WHERE postAttachment.post_id = ? AND postAttachment.version = ?; "; //포스트 추가내용들

    let tagListQs = "SELECT `tag`.id, `tag`.type, `tag`.contents " +        // 태그리스트
        "FROM tagAttachment " +
        "LEFT JOIN `tag` ON `tag`.id = `tagAttachment`.tag_id " +
        "WHERE `tagAttachment`.post_id = ? ";

    let commentListQs = "SELECT `comment`.id, `user`.id, `user`.name, `comment`.contents, `comment`.version, `comment`.select_type, `comment`.created_time " +
        "FROM `comment` " +
        "LEFT JOIN user ON user.id = `comment`.user_id " +
        "WHERE `comment`.post_id = ? "; // comment 리스트

    let commentAttachmentQs = "SELECT `commentAttachment`.comment_id, `commentAttachment`.url, `commentAttachment`.created_time " +
        "FROM `commentAttachment` " +
        "WHERE "; // comment들의 attachment들, commentList에서 comment id를 받아가지고 반복해서 binding


    const maxPostVersion = await con.query(maxPostVersionQs, [postId]);
    console.log(maxPostVersion);
    const userData = await con.query(userDataQs, [postId]);
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
                commentAttachmentQs += "comment_id = " + commentList[i].id + " OR ";
            } else if (i === commentList.length -1 ){
                commentAttachmentQs += "comment_id = " + commentList[i].id;
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
/* insertPostComment - post에 comment를 추가하는 쿼리

 */
export const insertPostComment = transaction(async(con, req) =>{

    let commentData = JSON.parse(req.body.commentData);
    let postId = commentData.postId;

    let commentFile = req.files;

    let commentQs = "INSERT INTO `comment` (post_id, user_id, contents, version) VALUES (?, ?, ?, ?); ";
    let commentAttachmentQs = "INSERT INTO `commentAttachment` (comment_id, url) VALUES (?, ?); ";

    const insertComment = await con.query(commentQs, [postId, commentData.userId, commentData.contents, commentData.version]);

    /*Upload Post ... Insert Post Attachment*/
    for(let i=0; i<commentFile.length; i++){   // 버전 1로 추가하는 개념임, insert 이기때문, 그 이후의 버전은 version을 추가하는 개념으로
        if( await uploadS3("post/"+postId+"/comment/"+insertComment.insertId,i+".png",req.files[i]) !== false){
            if(i === 0){    //썸네일
                await con.query(commentAttachmentQs, [insertComment.insertId,"https://s3.ap-northeast-2.amazonaws.com/smproject2018/post/"+postId+"/comment/"+insertComment.insertId+"/"+i+".png" ])
            }
            else{   //나머지 이미지
                await con.query(commentAttachmentQs, [insertComment.insertId, "https://s3.ap-northeast-2.amazonaws.com/smproject2018/post/"+postId+"/comment/"+insertComment.insertId+"/"+i+".png" ])
            }
        } else{
            await con.rollback();
            return false;
        }
    }

    return true;
});

export const commentSelectQuery = transaction(async (con, req) => {

    let selectData = req.body.selectData;

    let query = "UPDATE `comment` SET select_type = ? WHERE `comment`.id = ?; ";

    try {
        const result = await con.query(query, [selectData.selectType, selectData.id]);
    } catch(e){
        console.log(e);
        return false;
    }

    return true;
});
