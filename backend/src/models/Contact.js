module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define(
    "Contact",
    {
      contact_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullname: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email_address: {
        type: DataTypes.STRING(160),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING(160),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "contacts",
      timestamps: true,
    }
  );

  return Contact;
};
