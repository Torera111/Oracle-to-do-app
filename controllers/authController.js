const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { getConnection } = require('../config/db');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return  res.status(400).json({ message: "Username and password are required."});
    }   
    let connection;
    try {
        const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        connection = await getConnection();

        // Check if username already exists to return 409 without relying on DB exception
        try {
            const check = await connection.execute(
                "SELECT COUNT(*) AS CNT FROM users WHERE username = :1",
                [username]
            );
            const cntRow = check && check.rows && check.rows[0];
            const count = (cntRow && (cntRow.CNT || cntRow.COUNT || cntRow['COUNT(*)'])) || 0;
            if (count > 0) {
                return res.status(409).json({ message: 'Username already exists.' });
            }
        } catch (chkErr) {
            // if check fails, continue to attempt insert and rely on unique constraint handling
            console.warn('Username existence check failed, proceeding to insert:', chkErr && chkErr.message);
        }

        await connection.execute(
            "INSERT INTO users (username, password_hash) VALUES (:1, :2)",
            [username, hashedPassword]
        );
        await connection.commit();
        res.status(201).json({ message: "User registered successfully."});
    } catch (err){
        console.error('Register error:', err && err.message);
        // ORA-00001 is unique constraint violation in Oracle
        if (err && (err.errorNum === 1 || (typeof err.code === 'string' && err.code.includes('ORA-00001')))) {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        res.status(500).json({ message: "Error registering user."});
    } finally {
        if (connection) await connection.close();
    }
};

exports.login = async (req, res) => {

    const { username, password } = req.body;    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required."});
    }
    let connection;
    try {
        console.log("Attempting to connect to Oracle DB...");
        connection = await getConnection();
        console.log("✅ Connected to Oracle!");
        const result = await connection.execute(
            "SELECT id, password_hash FROM users WHERE username = :1",
            [username]
        );

        if (!result || !result.rows || result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid username or password."});
        }

        const user = result.rows[0];
        // Oracle may return columns in upper-case keys depending on driver settings
        const storedHash = user.PASSWORD_HASH || user.password_hash || user.passwordHash;
        const valid = await bcrypt.compare(password, storedHash);
        if (!valid) {
            return res.status(401).json({ message: "Invalid username or password."});
        }   
        const userId = user.ID || user.id;
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
        
    } catch (err){
        console.error(err);
        res.status(500).json({ message: "Error logging in."});
    } finally {
        if (connection) await connection.close();
    }
};