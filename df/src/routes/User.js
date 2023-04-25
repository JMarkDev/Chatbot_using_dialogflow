const express = require("express");
const Database = require("../config/database")
const router = express.Router();

router.get("/", async function (req, res) {
    const db = new Database();
    const conn = db.connection;

    conn.connect((err) => {
        if (err) {
            throw err;
        }
        conn.query("SELECT * FROM users", (err, result) => {
            if (err) {
                throw err;
            } 
                res.json(result);
        })
    })
})

router.post("/register", async function(req, res) {
    const db = new Database();
    const conn = db.connection;

    const query = "INSERT INTO users(`username`, `email`, `password`) VALUES(?, ?, ?)";
    const values = [
        req.body.username,
        req.body.email, 
        req.body.password
    ];

    conn.connect((err) => {
        if (err) {
            throw err;
        }
        conn.query(query, values, (err, result) => {
            if (err)
                throw err;
            console.log(result);
            return res.json({Success: true, message: "New User has been registered!"})
        });
    
    });
});

router.post("/login", async function(req, res) {
    const db = new Database();
    const conn = db.connection;

    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    const values = [
        req.body.email,
        req.body.password
    ]

    conn.connect((err) => {
        if (err) {
            throw err;
        }
        conn.query(query, values, (err, result) => {
            if (err) {
                throw err
            }
            if (result.length > 0) {
                return res.json({ success: true, message: "Login Successfully", data: result[0]})
            }
            else {
                return res.json({ success: false, message: "Log in Failed"});
            };
        });
    });
});

module.exports = router;