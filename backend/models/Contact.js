import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Contact = sequelize.define('Contact', {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
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
  department: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  status: {
    type: DataTypes.ENUM('unread', 'read', 'replied'),
    defaultValue: 'unread',
    allowNull: false,
  }
}, {
  timestamps: true,
});

export default Contact;
