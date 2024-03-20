import { Sequelize } from "sequelize"
import { DIALECT } from "./../config/databaseConfig"

const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env

console.log(`${DIALECT}://${DB_HOST}:${DB_PORT}/${DB_NAME}`)

export const sequelize = 
    DB_PORT === ""
        ? new Sequelize(`${DIALECT}://${DB_HOST}/${DB_NAME}`, {
            username: DB_USERNAME,
            password: DB_PASSWORD
        })
        : new Sequelize(`${DIALECT}://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
            username: DB_USERNAME,
            password: DB_PASSWORD
        })
