import {connect, transaction} from '../db';
import {uploadS3} from'../../lib/upload';

/*
*
* */
export const insertPostAndImg = transaction(async (con, req) =>{
    /*Qs : Query String*/
    let postData = JSON.parse(req.body.postData);
    let tagData = JSON.parse(req.body.tagData);
    let postFileData = req.files;
/* 태그 INSERT 안해도 됨 , Attachment만 tagData에 id 값 다 들어가있음.*/

    let insertPostQs = "INSERT INTO `post` (user_id, title) VALUES(?, ?); ";  //Post 추가 기본적으로 이것이 먼저 되어야지 연결된 테이블에도 내용 추가가능
    let insertPostContentsQs = "INSERT INTO `postContents` (post_id, version, contents) VALUES(?, ?, ?); "; //insert Post Contents
    let insertPostAttachmentQs = "INSERT INTO `postAttachment` (post_id, type, version, url) VALUES (?, ?, ?, ?); ";    // Post이미지 s3에 업로드 후 추가
    let insertTagAttachmentQs = "INSERT INTO `tagAttachment` (tag_id, post_id) VALUES ";  //태그 연동 추가, 이거 BulkInsert 필요함 쿼리 수정하고 파라미터 받는 것 대신 직접 string으로 때려넣기

    /*Insert Post*/
    const insertPost = await con.query(insertPostQs, [postData.userId, postData.title]);

    /*Insert Post Contents*/

    const insertContentsPost = await con.query(insertPostContentsQs, [insertPost.insertId, 1, postData.content]);

    /*Upload Post ... Insert Post Attachment*/
    for(let i=0; i<postFileData.length; i++){   // 버전 1로 추가하는 개념임, insert 이기때문, 그 이후의 버전은 version을 추가하는 개념으로
        if( await uploadS3("post/"+insertPost.insertId+"/contents/1",i+".png",req.files[i]) !== false){
            if(i === 0){    //썸네일
                await con.query(insertPostAttachmentQs, [insertPost.insertId, 0, 1, "https://s3.ap-northeast-2.amazonaws.com/smproject2018/post/"+insertPost.insertId+"/contents/1/"+i+".png" ])
            }
            else{   //나머지 이미지
                await con.query(insertPostAttachmentQs, [insertPost.insertId, 1, 1, "https://s3.ap-northeast-2.amazonaws.com/smproject2018/post/"+insertPost.insertId+"/contents/1/"+i+".png" ])
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
    insertTagAttachmentQs = insertTagAttachmentQs.slice(0, -1);
    insertTagAttachmentQs += "; ";

    const insertTagAttachment = await con.query(insertTagAttachmentQs, []);


    return true;
});

export const versionUpPost = transaction(async (con, req) => {
    let postData = JSON.parse(req.body.postData);
    let postId = postData.postId;
    let postFileData = req.files;

    let getMaxVersionQs = "SELECT max(version) as maxVersion FROM postContents WHERE post_id = ?; ";

    let insertPostContentsQs = "INSERT INTO `postContents` (post_id, version, contents) VALUES(?, ?, ?); "; //insert Post Contents
    let insertPostAttachmentQs = "INSERT INTO `postAttachment` (post_id, type, version, url) VALUES (?, ?, ?, ?); ";    // Post이미지 s3에 업로드 후 추가

    const getMaxVersion = await con.query(getMaxVersionQs, [postId]);

    let postVersion = Number(getMaxVersion[0].maxVersion)+1;
    console.log(postVersion);

    const insertPostContents = await con.query(insertPostContentsQs, [postId, postVersion, postData.contents]);

    for(let i=0; i<postFileData.length; i++){   // 버전 1로 추가하는 개념임, insert 이기때문, 그 이후의 버전은 version을 추가하는 개념으로
        if( await uploadS3("post/"+postId+"/contents/" + postVersion,i+".png",req.files[i]) !== false){
            if(i === 0){    //썸네일
                await con.query(insertPostAttachmentQs, [postId, 0, postVersion, "https://s3.ap-northeast-2.amazonaws.com/smproject2018/post/"+postId+"/contents/"+postVersion+"/"+i+".png" ])
            }
            else{   //나머지 이미지
                await con.query(insertPostAttachmentQs, [postId, 1, postVersion, "https://s3.ap-northeast-2.amazonaws.com/smproject2018/post/"+postId+"/contents/"+postVersion+"/"+i+".png" ])
            }
        } else{
            await con.rollback();
            return false;
        }
    }

    return true;
});
