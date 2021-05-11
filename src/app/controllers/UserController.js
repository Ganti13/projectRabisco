const User = require('../models/User')
const bcryptjs = require('bcryptjs')


module.exports = {
    async store(req, res){
        const userCreate = req.body
        try {
            const user = await User.create(userCreate)
            if(!user){return res.status(400).json({error: 'Erro ao realizar cadastro'})}
            user.password = undefined
            return res.json(user)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async index(req, res){
        if(!req.user.permission){return res.satus(400).json({error: 'Você não tem permissão'})}
        const {count} = await User.findAndCountAll()
        const limit = 5
        const totalPage = Math.ceil(count/ limit)
        let page = parseInt(req.query.page)

        if(page > totalPage){
            page = totalPage
        }
        let offset = (page - 1) * limit

        if(page < 1) {
            offset = 0
            page = 1
        }
        

        try {
            const users = await User
                .findAll({include:{
                    association:'tatoos',
                        attributes:['title', 'description','path','download']},
                            limit,offset})

            if(!users){return res.status(400).json({error: 'Erro ao listar os usuários'})}
            else if(users < 1){return res.json({message: 'Nenhum usuário cadastrado'})}

            users.forEach(element => {
                element.password = undefined    
            })

            users.forEach(element =>{
                element.tatoos.download += element.tatoos.path
            })

            return res.json({users, totalPage, currentPage: page})
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async show(req, res){
        try {
            const user = await User.findByPk(req.params.id)
            if(!user){return res.status(400).json({error: 'Erro ao listar o usuário'})}
            if(user.id === req.user.id || req.user.permission){
                user.password = undefined
                return res.json(user)
            }else{
                return res.status(400) 
                .json({error: 'Você não tem permissão para visualizar esse usuário'})
            }
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },
    
    async update(req, res){
        const data = req.body
        try {
            const user = await User.findByPk(req.params.id)
            if(!user){return res.status(400).json({error: 'Usuário não existe'})}
            else if(user.id !== req.user.id){return res.status(401)
                .json({error: 'Você não tem permissão para atualizar esse usuário'})}
            data.password = await bcryptjs.hash(data.password, 10)
            await user.update(data)
            user.password = undefined
            return res.json(user)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async destroy(req, res){
        try {
            const user = await User.findByPk(req.params.id)
            if(!user){return res.status(400).json({error: 'Usuário não existe'})}
            if(user.id === req.user.id || req.user.permission){
                await user.destroy()
                return res.json({message: 'Deletado com sucesso'})
            }else{
                return res.status(401)
                    .json({error: 'Você não tem permissão para fazer essa ação'})
                }
            
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async setPermission(req, res){
        const {permission: isSuper} = req.body
        try {
            if(!req.user.permission )return res.status(401)
                .json({error: 'Você não tem permissão para fazer essa ação'})
            const user = await User.findByPk(req.params.id)
            if(!user){return res.status(400).json({error: 'Usuário não existe'})}
            await user.update({isSuper})
            user.password = undefined
            return res.json(user)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
}