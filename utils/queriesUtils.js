const queries =  {
    getAllUsers: "SELECT id,name,email FROM users",
    addUser: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    getUserById: "SELECT id,name,email FROM users WHERE id = ?",
    getUserByEmail: "SELECT id,name,email FROM users WHERE email = ?",
    updateUserById: "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
    deleteUserById: "DELETE FROM users WHERE id = ?"
}

module.exports = { queries };