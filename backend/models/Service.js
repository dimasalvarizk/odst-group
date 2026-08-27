import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  badge: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.TEXT('long'), // Maps to LONGTEXT in MySQL for base64 images/data URIs
    allowNull: true,
  },
  imageLeft: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
});

export default Service;
