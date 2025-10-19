const express = require("express");
const path = require("path")
const cors = require("cors")
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
app.use(cors());
app.use(express.json()); // 👈 Needed to parse JSON bodies
app.use(express.static('.')); // Serve index.html if needed

// Simple request logger for debugging
app.use((req, res, next) => {
	console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
	next();
});

app.use(express.static(path.join(__dirname, 'public')))

// Import routes
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);





const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`))