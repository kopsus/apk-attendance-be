import { DataTypes } from 'sequelize'
import { sequelize } from './../accessor/sequelize'

export interface ICompany {
    id: number
    name: string
    latitude: number
    longitude: number
}

export const companyEntity = sequelize.define(
    'Company',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'name',
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clock_in: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        clock_out: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    },
)
