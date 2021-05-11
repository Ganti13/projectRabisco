require('dotenv').config()

module.exports = {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
    database: process.env.DATABASE,
    define: {
        timestamps: true
    }
}