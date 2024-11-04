const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3003;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('ecommerce-website')); 
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sky@2204',
    database: 'prathamesh'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// User registration
app.post("/register", (req, res) => {
    const { fullname, age, email, phno, gender, password } = req.body;

    const checkQuery = "SELECT * FROM loginusers WHERE email = ?";
    db.query(checkQuery, [email], (err, result) => {
        if (err) return res.status(500).send('Server error.');

        if (result.length > 0) return res.status(409).send("User with this email already exists.");

        const insertQuery = "INSERT INTO loginusers (name, age, email, phno, gender, password) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(insertQuery, [fullname, age, email, phno, gender, password], (err) => {
            if (err) return res.status(500).send('Server error.');
            res.redirect("/login.html");
        });
    });
});

// User login
const cors = require('cors');
app.use(cors({
    origin: 'https://your-netlify-site.netlify.app' // Replace with your Netlify site URL
}));

// User login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM loginusers WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, result) => {
        if (err) return res.status(500).send('Server error.');

        // If credentials are incorrect, redirect to login with error parameter
        if (result.length === 0) {
            return res.redirect("/login.html?error=true");
        }
        
        req.session.user_id = result[0].id;
        const sessionId = generateUniqueSessionId();
        req.session.session_id = sessionId;

        const insertSessionQuery = "INSERT INTO sessions (user_id, session_id) VALUES (?, ?)";
        db.query(insertSessionQuery, [req.session.user_id, sessionId], (err) => {
            if (err) return res.status(500).send('Server error.');
            res.redirect("/index.html");
        });
    });
});


app.post('/cart', (req, res) => {
    const { user_id, product_id, product_name, quantity, price } = req.body;

    db.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [user_id, product_id], (err, results) => {
        if (err) return res.status(500).send('Database query error');

        if (results.length > 0) {
            const newQuantity = results[0].quantity + parseInt(quantity);
            db.query('UPDATE cart SET quantity = ?, price = ? WHERE user_id = ? AND product_id = ?', [newQuantity, price, user_id, product_id], (updateErr) => {
                if (updateErr) return res.status(500).send('Update error');
                res.send('Item updated in cart');
            });
        } else {
            db.query('INSERT INTO cart (user_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)', [user_id, product_id, product_name, quantity, price], (insertErr) => {
                if (insertErr) return res.status(500).send('Insert error');
                res.send('Item added to cart');
            });
        }
    });
});

app.get('/check-session', (req, res) => {
    if (req.session.user_id) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

function generateUniqueSessionId() {
    return crypto.randomBytes(16).toString('hex');
}
// script.js

// function toggleMenu() {
//     const navLinks = document.getElementById("navLinks");

//     // Check if navLinks is found
//     if (navLinks) {
//         navLinks.classList.toggle("active");
//     } else {
//         console.error("Element with id 'navLinks' not found.");
//     }
// }
// User login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM loginusers WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, result) => {
        if (err) return res.status(500).send('Server error.');

        // If credentials are incorrect, redirect to login with error parameter
        if (result.length === 0) {
            return res.redirect("/login.html?error=true");
        }
        
        req.session.user_id = result[0].id;
        const sessionId = generateUniqueSessionId();
        req.session.session_id = sessionId;

        const insertSessionQuery = "INSERT INTO sessions (user_id, session_id) VALUES (?, ?)";
        db.query(insertSessionQuery, [req.session.user_id, sessionId], (err) => {
            if (err) return res.status(500).send('Server error.');
            res.redirect("/index.html");
        });
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
