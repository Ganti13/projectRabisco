const { Model, DataTypes } = require("sequelize")
const sequelize = require('../../database')
const Image = require('./Image')

class Tatoo extends Model{}

Tatoo.init({
    path: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    download:{
        type: DataTypes.VIRTUAL,
        get(){
            return process.env.BASE_URL+"/images/"+this.path
        }
    }
},{
    sequelize,
    tableName: 'tatoos'
})

Image.belongsTo(Tatoo, {foreignKey: 'tatooId', as : 'tatoo'})
Tatoo.hasMany(Image, {foreignKey: 'tatooId', as : 'images'})

module.exports = Tatoo