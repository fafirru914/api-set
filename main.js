const express = require('express');
const app = express();
const { getAllUser, addUser, getUserById, updateUserById, deleteUserById, getUserByEmail } = require('./userController');

app.use(express.json());

app.get("/api/data/users", (req, res) => {
    getAllUser()
        .then((users) => {
            res.json(users);
        })
        .catch((error) => {
            console.error('Error', error);
            res.status(500).json({ error: "Failed to fetch user from database" })
        })
})

app.get('/api/data/getuser/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await getUserById(id);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/data/getuser/', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        res.status(400).json({ error: "email parameter is required" })
    }

    try {
        const result = await getUserByEmail(email);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error: "User not found"
        })
    }
})

app.post("/api/data/user", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(500).json({ error: "name, email, and password are required" });
        return;
    }

    try {
        const data = await addUser(name, email, password);
        res.json(data);
    } catch (error) {
        console.error('Error', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: false,
                error: "User already exists"
            })
        }
        res.status(500).json({ error: "Failed to create user" })
    }
})

app.put('/api/data/user/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ error: "name, email, password are required" });
        return;
    }

    try {
        const result = await updateUserById(id, name, email, password);
        res.json(result);
    } catch (error) {
        console.error('Error', error)
        res.status(500).json({ error: error.message })
    }

})

app.delete('/api/data/user/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteUserById(id);
        res.json(result);
    } catch (error) {
        console.error('Error', error)
        res.status(500).json({ error: error.message })
    }
})

const port = 4000;
app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
})