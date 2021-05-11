const jwt = require('jsonwebtoken')

module.exports =  (req, res, next)=>{
    try {
        const auth = req.headers.authorization?.replace('Bearer ','').trim()
        if(!auth){return res.status(401).json({error: 'Permissão inválida'})}
        jwt.verify(auth, process.env.SECRET, (err, decoded)=>{
        if(err){
            return res.status(401).json({error: 'Permissão inválida'})
        }else{
            req.user = decoded
        }
    })

    next()

    } catch (error) {
        return res.status(401).json({error: error.message})
    }
} 