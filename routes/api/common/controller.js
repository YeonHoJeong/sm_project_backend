import {insertPostLike, deletePostLike} from '../../../database/common/query';

export const insertLike = async (req, res) => {
    let result = await insertPostLike(req);

    if(result === true){
        res.send(200, {message :"success"});
    } else{
        res.send(500, {message :"fail"});
    }
};

export const deleteLike = async (req, res) => {
    let result = await deletePostLike(req);

    if(result === true){
        res.send(200, {message :"success"});
    } else{
        res.send(500, {message :"fail"});
    }
};