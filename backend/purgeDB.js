const mongoose = require('mongoose');
require('dotenv').config();

async function purgeDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;

    const collectionsToDrop = ['Account', 'Conversation', 'Message', 'UserConversation', 'UserSeenMessage'];
    
    for (const col of collectionsToDrop) {
      try {
        await db.dropCollection(col);
        console.log(`Dropped collection: ${col}`);
      } catch (err) {
        if (err.codeName === 'NamespaceNotFound') {
          console.log(`Collection ${col} not found, skipping.`);
        } else {
          console.error(`Error dropping ${col}:`, err.message);
        }
      }
    }

    const result = await db.collection('users').deleteMany({
      $or: [
        { role: { $exists: false } },
        { hashedPassword: { $exists: true } },
        { emailVerified: { $exists: true } }
      ]
    });
    
    console.log(`Purged ${result.deletedCount} old invalid user documents.`);
    
    console.log("Database purge complete.");
    process.exit(0);
  } catch (err) {
    console.error("Purge failed:", err);
    process.exit(1);
  }
}

purgeDB();
