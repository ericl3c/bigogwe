module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name_user: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false, field: 'password' },
    role: { type: DataTypes.ENUM('ceo', 'Tour_Guide'), defaultValue: 'Tour_Guide' },

    // Your DB uses snake_case column name: created_at
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
  }, {
    tableName: 'users',
    timestamps: true,
    updatedAt: false,
  });

  return User;
};
