import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Newsletter = sequelize.define('Newsletter', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email is already subscribed to the newsletter'
    },
    validate: {
      isEmail: true,
      notEmpty: true,
    }
  }
}, {
  timestamps: true,
});

export default Newsletter;
