const express = require('express');
const {reader, writer} = require('./fs.service');
const {body,validationResult} = require('express-validator');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send("Hello")
})
app.get('/users', async (req, res) => {
    try {
        const users = await reader();
        res.json(users);
    } catch (e) {
        res.status(400).json(e.message)
    }
});

app.post('/users',[
    body('name').isLength({ min: 5 })
        .withMessage('Username must be at least 5 characters long'),
    body('email').isEmail()
        .withMessage('Invalid email address'),
    body('password').isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    try {
        if (errors.isEmpty()) {
            const {name, email, password} = req.body;
            const users = await reader();
            const newUser = {id: users[users.length - 1].id + 1, name, email, password}
            users.push(newUser);
            await writer(users);
            res.status(201).json(newUser);
        }
    } catch (e) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //res.status(400).json(e.message)
    }
})

app.get('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const users = await reader();

        const user = users.find((user) => user.id === userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (e) {
        res.status(400).json(e.message)
    }
})

app.put('/users/:userId', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const userId = Number(req.params.userId);
        const users = await reader();

        const index = users.findIndex((user) => user.id === userId);
        if (index === -1) {
            return res.status(404).send('User not found');
        }
        users[index] = {...users[index], name, email, password}
        await writer(users);

        res.status(201).json(users[index]);
    } catch (e) {
        res.status(400).json(e.message)
    }
})

app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const users = await reader();

        const index = users.findIndex((user) => user.id === userId);
        if (index === -1) {
            return res.status(404).send('User not found');
        }
        users.splice(index, 1);
        await writer(users);
        res.sendStatus(204);
    } catch (e) {
        res.status(400).json(e.message)
    }
})

const PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}/users`);
})