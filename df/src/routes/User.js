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
            const firstLetter = req.body.username.charAt(0).toUpperCase();
            return res.json({success: true, message: "New User has been registered!", firstLetter: firstLetter})
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
                const user = result[0];
                const firstLetter = user.username.charAt(0).toUpperCase();
                const userData = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    firstLetter: firstLetter // add the first letter to the user data
                }
                return res.json({ success: true, message: "Login Successfully", data: userData})
            }
            
            else {
                return res.json({ success: false, message: "Log in Failed"});
            };
        });
    });
});

module.exports = router;
