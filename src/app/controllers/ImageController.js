const Image = require('../models/Image')
const {unlink} = require('fs')
const {resolve} = require('path')

module.exports = {
    async store(req, res){
        const files = req.files
        files.forEach(async element => {
            await Image.create({
                path: element.filename,
                tatooId: req.params.id
            })
        });
        return res.json({message: 'salvo com sucesso'})
    },

    async destroy(req, res){
        try {
            const image = await Image.findByPk(req.params.imageId)
            await image.destroy(image)
            unlink(resolve(__dirname,'..','..','uploads','images',image.path), err =>{
            console.log(err)
        })
            return res.json({message: 'deletado com sucesso'})
        } catch (error) {
            return res.status(400).json({error: error.message})
        }

    }
}