const Tatoo = require('../models/Tatoo')
const {resolve} = require('path')
const {unlink} = require('fs')

module.exports = {
    async store(req, res){
        const files = req.file
        const tatooCreate = req.body
        try {
            if(!files){return res.status(400).json({error: 'Selecione alguma imagem'})}
            else if(!tatooCreate){return res.status(400).json({error: 'Erro ao salvar'})}
            const tatoo = await Tatoo.create({
                path: files.filename,
                title: tatooCreate.title,
                description: tatooCreate.description,
                userId: req.user.id
            })

            return res.json(tatoo)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },


    async index(req, res){
        const {count} = await Tatoo.findAndCountAll({where:{userId: req.user.id}})
        const limit = 2
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
            const tatoos = await Tatoo
                .findAll({include:{
                    association: 'images'},
                        limit, offset, 
                            where:{userId: req.user.id}})

            if(!tatoos){return res.status(400).json({error: 'Erro ao Carregar as Tatoos'})}
                else if(tatoos < 1){return res.status(400)
                    .json({error: 'nenhuma Tatoo encontrada'})}

            return res.json({tatoos, totalPage, currentPage: page})

        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },


    async show(req, res){
        try {
            const tatoo = await Tatoo.findByPk(req.params.id)
            if(!tatoo){return res.status(400)
                .json({error: 'nenhuma Tatoo encontrada'})}
                    else if(tatoo.userId !== req.user.id){
                        return res.status(401).json({error: 'Sem permissão'})
                    }
            return res.json(tatoo)

        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async update(req, res){
        const files = req.file
        const tatooUpdate = req.body
        try {
            if(!files){return res.status(400).json({error: 'Selecione alguma imagem'})}
            else if(!tatooUpdate){return res.status(400).json({error: 'Erro ao salvar'})}
            const tatoo = await Tatoo.findByPk(req.params.id)
            if(!tatoo){return res.status(400).json({error: 'Tatoo não encontrada'})}
            else if(tatoo.userId !== req.user.id){
                return res.status(401).json({error: 'Sem permissão'})
            }
            await tatoo.update({...tatooUpdate, files})

            return res.json(tatoo)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async destroy(req, res){
        try {
            const tatoo = await Tatoo.findByPk(req.params.id)
            if(!tatoo){return res.status(400).json({error: 'Erro ao deletar a Tatoo'})}
            if(tatoo.userId === req.user.id || req.user.permission){

                await tatoo.destroy()
                unlink(resolve(__dirname,'../../uploads/images/'+ tatoo.dataValues.path), err=>{
                    console.log(err)
                    return res.json({message: 'Deletado com sucesso'})
                })
            }else{
                return res.status(400).json({error: 'Não foi possivel excluir'})
            }
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async downloadImage(req, res){
        const image = await Tatoo.findOne({where: {path:req.params.path}})
        return res.download(resolve(__dirname,'..','..','uploads','images',image.dataValues.path))
    }
}