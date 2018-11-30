import {connect, transaction} from '../db';
import uploadS3 from'../../lib/upload';

/*
*
* */
export const insertPostAndImg = transaction(async (con, req) =>{
    /*Qs : Query String*/
    let postData = req.body.postData;
    let tagData = req.body.tagData;
/* 태그 INSERT 안해도 됨 , Attachment만 tagData에 id 값 다 들어가있음.*/

    let insertPostQs = "INSERT INTO `post` (user_id, title, contents) VALUES(?, ?, ?); ";  //Post 추가 기본적으로 이것이 먼저 되어야지 연결된 테이블에도 내용 추가가능
    let insertTagAttachmentQs = "INSERT INTO `tagAttachment` (tag_id, post_id) VALUES (?, ?); ";  //태그 연동 추가, 이거 BulkInsert 필요함 쿼리 수정하고 파라미터 받는 것 대신 직접 string으로 때려넣기
    let insertPostAttachmentQs = "";    // Post이미지 s3에 업로드 후 추가
    let insertPostVersionQs = "";       // Post, PostAttachment 다 추가 된 후 Version 추가

    const insertPost = await con.query(insertPostQs, [postData.userId, postData.title, postData.contents]);

    console.log(req);
    return result;
});


