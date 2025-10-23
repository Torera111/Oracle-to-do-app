const oracledb = require("oracledb");
const dotenv = require("dotenv");

dotenv.config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

// Create a reusable function to get DB connections
async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig); 
    return connection;
  } catch (err) {
    console.error("Error getting DB connection:", err);
    throw err;
  }
}

module.exports = { getConnection, oracledb };
