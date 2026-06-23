module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Bookings",
    {
      booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      visitor_category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      select_activities: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number_of_visitors: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      amount_paid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      booking_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      tableName: "bookings",
      timestamps: false,
    }
  );

  return Booking;
};