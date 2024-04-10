import { DataTypes } from 'sequelize'
import { sequelize } from './../accessor/sequelize'

export const employeeEntity = sequelize.define(
    'Employee',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'email',
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        freezeTableName: true,
    },
)
