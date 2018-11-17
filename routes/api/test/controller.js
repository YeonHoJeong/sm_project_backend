import {connectionTest, transactionTest} from '../../../database/test/query';
import {uploadS3} from '../../../lib/upload';
export const connectCall = async (req, res) => {
    let startSql = await connectionTest();

    res.send(startSql);
};

export const transactionCall = async (req, res) => {
    let startSql = await transactionTest();

    res.send(startSql);
};

export const imageUploadTest = async (req, res) => {
    uploadS3('test',req.files[0].originalname,req.files[0]);//path,fileName, file 여기서 fileName을 형식에 맞게 고쳐주어야함.
    console.log(req.files);
    res.send(req.files);
};