const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3003;

let products = [];

const users = [
    { id: 1, username: 'admin', email: "admin@gmail.com", password: "ad12345min", is_admin: true },
    { id: 2, username: "anna", email: "annann@gmail.com", password: "an12an12n", is_admin: false }
];


// 1. task 1
const validateRequestFields = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || username.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters long." });
    }
    if (!email) {
        return res.status(400).json({ error: "Email is not valid." });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }
    next();
};


// 2. task 2
const logRequestDetails = (req, res, next) => {
    const time = new Date();
    console.log(`[${time}] Method: ${req.method}, URL: ${req.url}`);
    next();
};
app.use(logRequestDetails);


// 3. task 3
const restrictAccessByRole = (req, res, next) => {
    const { is_admin } = users.find(user => user.email === req.body.email) || {};
    if (!is_admin) {
        return res.status(403).json({ message: "Access Denied" });
    }
    next();
};


// 4. task 4
const sanitizeInput = (req, res, next) => {
    if (req.body.username) {
        req.body.username = req.body.username.trim();
    }
    if (req.body.email) {
        req.body.email = req.body.email.trim().toLowerCase();
    }
    if (req.body.password) {
        req.body.password = req.body.password.trim();
    }
    next();
};
app.use((req, res, next) => {
    if (['POST', 'PUT'].includes(req.method)) sanitizeInput(req, res, next);
    else next();
});


// 5. task 5
const validateUserId = (req, res, next) => {
    if (!req.body.id) {
        return res.status(400).json({ message: "User ID is required." });
    }
    next();
};

const checkUserExists = (req, res, next) => {
    const user = users.find(user => user.id === req.body.id);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    next();
};







app.post('/users', validateRequestFields, (req, res) => {
    res.status(201).json({ message: 'User created successfully.', user: req.body });
});

app.post('/products', restrictAccessByRole, (req, res) => {
    products.push(req.body);
    res.status(201).json({ message: 'Product created successfully.', product: req.body });
});

app.post('/orders', [validateUserId, checkUserExists], (req, res) => {
    res.status(201).json({ message: 'Order placed successfully.', order: req.body });
});







app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
