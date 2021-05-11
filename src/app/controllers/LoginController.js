const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bcryptjs = require('bcryptjs')
module.exports = {
    async login(req, res){
        const {email, password} = req.body
        try {
            const user = await User.findOne({where:{email: email}})
            if(!user){return res.status(400).json({error: 'Login inválido'})}

            const isSame = await bcryptjs.compare(password, user.password)
            if(!isSame){return res.status(400).json({error: 'Login inválido'})}

            const token = jwt.sign({id: user.id, permission: user.isSuper}, process.env.SECRET, {
                expiresIn: '15m'
            })
            
            const refreshToken = jwt.sign({id: user.id, permission: user.isSuper}, process.env.SECRET_REFRESH, {
                expiresIn: '1d'
            })

            return res.json({token, refreshToken})

        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
}