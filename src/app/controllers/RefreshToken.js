const jwt = require('jsonwebtoken')

module.exports = {
    async refreshToken(req, res){
        const refresh = req.body.refresh
        if(!refresh){
            res.status(401).json({error: 'Permissão inválida'})
        }

        jwt.verify(refresh, process.env.SECRET_REFRESH, (err, user)=>{
            if(!err){
                const token = jwt.sign({id: user.id, permission: user.permission},
                    process.env.SECRET,{expiresIn: '15m'})
                return res.json({token})
            }else{
                res.status(401).json({error: 'Permissão inválida'})
            }
        })
    }
}