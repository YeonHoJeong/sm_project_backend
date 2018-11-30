import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';


let s3 = new aws.S3();

export const uploadS3 = async function( path,fileName,file){
    let params = {
        Bucket : "smproject2018",
        Key : path+'/'+fileName,
        ACL : 'public-read',
        Body : file.buffer,
        ContentType : file.mimetype
    };
    await s3.putObject(params, function(err, result) {
        if(err){
            console.log(err);
            return false;
        } else{
            console.log("successfully upload data to " + params.Key);
            console.log(result);
            return result;
        }
    });
};