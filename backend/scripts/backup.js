require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const COLLECTIONS_TO_BACKUP = ['User', 'Student', 'Teacher', 'Course', 'Enrollment', 'Transaction', 'QuizResult', 'SupportTicket'];

const backup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const backupDir = path.join(__dirname, '..', 'backups', new Date().toISOString().replace(/:/g, '-'));
    fs.mkdirSync(backupDir, { recursive: true });

    for (const collectionName of COLLECTIONS_TO_BACKUP) {
      try {
        const collection = mongoose.connection.collection(collectionName);
        const documents = await collection.find({}).toArray();

        const filePath = path.join(backupDir, `${collectionName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
        console.log(`Backed up ${collectionName}: ${documents.length} documents`);
      } catch (err) {
        console.error(`Failed to backup ${collectionName}:`, err.message);
      }
    }

    const summary = {
      timestamp: new Date().toISOString(),
      collections: COLLECTIONS_TO_BACKUP,
      path: backupDir,
    };
    fs.writeFileSync(path.join(backupDir, '_summary.json'), JSON.stringify(summary, null, 2));

    console.log(`\nBackup completed successfully at: ${backupDir}`);
    process.exit(0);
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
};

backup();
