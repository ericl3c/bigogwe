module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    slug: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    duration: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    capacity: { type: DataTypes.INTEGER },
    imageUrl: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  });

  return Service;
};
