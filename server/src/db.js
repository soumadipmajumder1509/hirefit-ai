const mongoose = require('mongoose');

let connecting = null;

async function connect() {
  if (mongoose.connection.readyState >= 1) return;
  if (connecting) return connecting;
  connecting = mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB connected');
    connecting = null;
  });
  return connecting;
}

module.exports = { connect };
