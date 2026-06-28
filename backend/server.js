require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { configureCloudinary } = require('./config/cloudinary');
const { initializeSocket } = require('./sockets/socket.handler');
const { startCronJobs } = require('./services/cron.service');
const Admin = require('./models/Admin');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  configureCloudinary();

  try {
    await seedAdmin();
  } catch (error) {
    console.log('Admin seed skipped (DB may not be connected):', error.message);
  }

  const httpServer = http.createServer(app);
  initializeSocket(httpServer);
  startCronJobs();

  httpServer.listen(PORT, () => {
    console.log(`EDUCOURS API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin account already exists');
      return;
    }

    const admin = await Admin.create({
      fullName: 'Notio Fopa Joel',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_DEFAULT_PASSWORD,
      phone: '+237 678095581',
      role: 'admin',
      isVerified: true,
      superAdmin: true,
    });

    console.log(`Admin account created: ${admin.email}`);
  } catch (error) {
    console.error('Admin seed error:', error.message);
  }
};

startServer();
