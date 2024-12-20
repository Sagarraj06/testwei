const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { findUserByEmail, findUserById, createUser } = require('./models/users');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get('/', (req, res) => {
    res.render("dashboard");
});



app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = findUserByEmail(email);

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        res.redirect('/volunteer');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});

app.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

app.post('/signup', async (req, res) => {
    try {
        const { fullName, username, phone, email, password } = req.body;
        
        if (findUserByEmail(email)) {
            return res.render('signup', { error: 'Email already exists' });
        }

        await createUser({ fullName, username, phone, email, password });
        res.redirect('/login');
    } catch (error) {
        res.render('signup', { error: 'Error creating account' });
    }
});

app.get('/victim', (req, res) => {
    res.render('victim');
});

app.get('/contactus',(req,res)=>{
    res.render('contactus');
})

app.get('/aboutus',(req,res)=>{
    res.render('aboutus');
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/volunteer',requireAuth,(req,res)=>{
    res.render("volunteer");
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});