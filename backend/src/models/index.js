const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "bigogwe_db",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    define: {
      // Use snake_case column names (created_at, updated_at) to match DB
      underscored: true,
    },
  }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Booking = require("./Booking")(sequelize, DataTypes);
db.Gallery = require("./Gallery")(sequelize, DataTypes);
db.User = require("./User")(sequelize, DataTypes);
db.Contact = require("./Contact")(sequelize, DataTypes);

module.exports = db;
