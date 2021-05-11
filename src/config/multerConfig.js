const multer = require('multer')
const {resolve} = require('path')

module.exports = {
    storage: multer.diskStorage({
        destination: (req, res, cb)=>{
            cb(null, resolve(__dirname,'..', 'uploads', 'images'))
        },
        filename: (req, file, cb)=>{
            const filename = Date.now()+'-'+file.originalname
            cb(null, filename)
        }
    })
}