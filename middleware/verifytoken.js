const jwt = require('jsonwebtoken');

function verifyToken(req,res,next){
    const authenticationToken = req.headers["authorization"];
    if(!authenticationToken){
        console.log(req.headers);
        res.json({
            error:{
                authenticationError:"User is not authorized to access"
            }
        });
        return;
    }
    jwt.verify(authenticationToken,'secret',(err,authData)=>{
        if(err){
            res.json({
                error:{
                    authenticationError:err
                }
            });
        }else{
            req.userName =authData.userName;
            next();
        }
    });
}

module.exports  = {
    verifyToken
};