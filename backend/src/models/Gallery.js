module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define('Gallery', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'gallery_id' },
    image: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    date_added: { type: DataTypes.DATEONLY, allowNull: false }
    ,
    // Explicit mapping for created_at column
    createdAt: { type: DataTypes.DATE, field: 'created_at' }
  }, {
    tableName: 'gallery',
    timestamps: true,
    updatedAt: false
  });

  return Gallery;
};
