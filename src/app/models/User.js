const {Model, DataTypes} = require('sequelize')
const sequelize = require('../../database/index')
const bcryptjs = require('bcryptjs')
const Tatoo = require('./Tatoo')

class User extends Model{}

User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isSuper: DataTypes.BOOLEAN
},{
    sequelize, 
    tableName: 'users'
})

User.beforeCreate(async (user)=>{
    user.password = await bcryptjs.hash(user.password, 10)
})


User.hasMany(Tatoo, {foreignKey: 'userId', as: 'tatoos'})
Tatoo.belongsTo(User, {foreignKey: 'userId', as: 'user'})

module.exports = User