const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// In-memory user store (replace with database in production)
const users = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('.'));
app.use(session({
    secret: 'unknown-solutions-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Make user available to all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// API Routes
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        progress: {
            modulesCompleted: [],
            resourcesDownloaded: []
        }
    };

    users.push(user);
    res.json({ success: true, message: 'Registration successful' });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Set session
    req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email
    };

    res.json({ success: true, message: 'Login successful' });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/user', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = users.find(u => u.id === req.session.user.id);
    res.json({
        name: user.name,
        email: user.email,
        progress: user.progress
    });
});

app.post('/api/progress/module', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { moduleId } = req.body;
    const user = users.find(u => u.id === req.session.user.id);

    if (!user.progress.modulesCompleted.includes(moduleId)) {
        user.progress.modulesCompleted.push(moduleId);
    }

    res.json({ success: true, progress: user.progress });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});