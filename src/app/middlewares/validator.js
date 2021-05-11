const fastest = require('fastest-validator')
const User = require('../models/User')
module.exports = {
    async user(req, res, next){
        const validate = new fastest()
        try {
            const users = req.body
            const user = await User.findOne({where: {email: users.email}})
            if(user){throw new Error('Email ja cadastrado')}
            const rules = {
                username: {
                    type: 'string',
                    min:3,
                    trim: true,
                    messages:{
                        'string': 'Digite um nome válido',
                        'stringMin': 'Nome muito curto (minimo 3 caracteres)'
                    }
                },
                email:{
                    type: 'email',
                    trim: true,
                    messages:{
                        'email':'Digite um email válido'
                    }
                },
                password: {
                    type: 'string',
                    min: 6,
                    trim : true,
                    messages: {
                        'stringMin': 'A senha precisa ter no minimo 6 caracteres'
                    }
                }
            }

            const check = validate.compile(rules)
            const checked = await check(users)
            if(checked === true){
                next()
                
        }else{
            return res.status(400).json({ error: checked[0].message})
        }
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
        
    }
}