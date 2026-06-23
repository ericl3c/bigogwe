const { Sequelize } = require('sequelize');
require('dotenv').config();
const db = require('./src/models');

async function seed() {
  await db.sequelize.sync({ force: false });

  const services = [
    { title: 'Hiking', slug: 'hiking', description: 'Guided hikes', duration: '4h', price: 15000 },
    { title: 'Camping', slug: 'camping', description: 'Overnight camping', duration: 'Overnight', price: 30000 },
  ];

  for (const s of services) {
    await db.Service.findOrCreate({ where: { slug: s.slug }, defaults: s });
  }

  console.log('Seed completed');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
