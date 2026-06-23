const bcrypt = require('bcrypt');
require('dotenv').config();
const db = require('./src/models');

async function seed() {
  try {
    await db.sequelize.sync({ force: false });

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin123', 10);

    const adminUser = {
      name_user: 'Admin User',
      email: 'admin@bigogwe.com',
      password: hashedPassword,
      role: 'ceo'
    };

    const [user, created] = await db.User.findOrCreate({
      where: { email: adminUser.email },
      defaults: adminUser
    });

    if (created) {
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@bigogwe.com');
      console.log('🔑 Password: Admin123');
    } else {
      console.log('⚠️  User already exists');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
