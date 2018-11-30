import {connect, transaction} from '../db';
import {uploadS3} from'../../lib/upload';

/*
*
* */
export const insertPostAndImg = transaction(async (con, req) =>{
    /*Qs : Query String*/
    let postData = req.body.postData;
    let tagData = req.body.tagData;
    let postFileData = req.files;
/* 태그 INSERT 안해도 됨 , Attachment만 tagData에 id 값 다 들어가있음.*/

    let insertPostQs = "INSERT INTO `post` (user_id, title, contents) VALUES(?, ?, ?); ";  //Post 추가 기본적으로 이것이 먼저 되어야지 연결된 테이블에도 내용 추가가능
    let insertPostAttachmentQs = "INSERT INTO `postAttachment` (post_id, type, url) VALUES (?, ?, ?); ";    // Post이미지 s3에 업로드 후 추가
    let insertTagAttachmentQs = "INSERT INTO `tagAttachment` (tag_id, post_id) VALUES ; ";  //태그 연동 추가, 이거 BulkInsert 필요함 쿼리 수정하고 파라미터 받는 것 대신 직접 string으로 때려넣기
    let insertPostVersionQs = "INSERT INTO `postVersion` (post_id, postAttachment_id, ";       // Post, PostAttachment 다 추가 된 후 Version 추가

    /*Insert Post*/
    const insertPost = await con.query(insertPostQs, [postData.userId, postData.title, postData.contents]);

    /*Upload Post ... Insert Post Attachment*/
    for(let i=0; i<postFileData.length; i++){   // 버전 1로 추가하는 개념임, insert 이기때문, 그 이후의 버전은 version을 추가하는 개념으로
        if( await uploadS3("post/"+insertPost.insertId+"/contents/1",i,req.files[i]) !== false){
            if(i === 0){    //썸네일
                con.query(insertPostAttachmentQs, [insertPost.insertId, 0, "https://s3.ap-northeast-2.amazonaws.com/smproject2018/post/"+insertPost.inserId+"/contents/1/"+i+".jpeg" ])
            }
            else{   //나머지 이미지
                con.query(insertPostAttachmentQs, [insertPost.insertId, 1, "https://s3.ap-northeast-2.amazonaws.com/smproject2018/post/"+insertPost.inserId+"/contents/1/"+i+".jpeg" ])
            }
        } else{
            await con.rollback();
            return false;
        }
    }

    /*Insert Tag Attachment*/
    for (let i=0; i<tagData.length; i++){
        insertTagAttachmentQs += "("+tagData[i].id+","+insertPost.insertId+"),";
    }
    insertTagAttachmentQs.slice(0, -1);
    insertTagAttachmentQs += "; ";

    const insertTagAttachment = await con.query(insertTagAttachmentQs, []);




    return result;
});


