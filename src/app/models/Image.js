const sequelize = require('../../database/')
const {DataTypes, Model} = require('sequelize')

class Image extends Model{}

Image.init({
    path: DataTypes.STRING
},{
    sequelize,
    tableName: 'images'
})

module.exports = Image