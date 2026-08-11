const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || "smarttask",
    user: process.env.DB_USER || "smarttask",
    password: process.env.DB_PASSWORD || "smarttask_password",
    waitForConnections: true,
    connectionLimit: 10
});

async function initDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Table tasks verifiee/creee avec succes.");
    } catch (error) {
        console.error(
            "Erreur lors de l'initialisation de la base :",
            error.message
        );
    }
}

app.get("/", (req, res) => {
    res.json({
        message: "SmartTask Backend fonctionne !",
        status: "OK"
    });
});

app.get("/api/tasks", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM tasks ORDER BY id DESC"
        );

        res.json(rows);
    } catch (error) {
        console.error("Erreur :", error.message);

        res.status(500).json({
            error: "Impossible de recuperer les taches"
        });
    }
});

app.post("/api/tasks", async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                error: "Le titre est obligatoire"
            });
        }

        const [result] = await pool.query(
            "INSERT INTO tasks (title) VALUES (?)",
            [title]
        );

        const [rows] = await pool.query(
            "SELECT * FROM tasks WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json(rows[0]);

    } catch (error) {
        console.error("Erreur :", error.message);

        res.status(500).json({
            error: "Impossible d'ajouter la tache"
        });
    }
});

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM tasks WHERE id = ?",
            [id]
        );

        res.json({
            message: "Tache supprimee"
        });

    } catch (error) {
        console.error("Erreur :", error.message);

        res.status(500).json({
            error: "Impossible de supprimer la tache"
        });
    }
});

app.listen(PORT, async () => {
    console.log(`SmartTask Backend demarre sur le port ${PORT}`);
    await initDatabase();
});
