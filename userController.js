const { createConnection } = require("./utils/dbUtils.js");
const { hashPassword } = require("./utils/bcryptUtils.js");
const { generateToken } = require("./utils/jwtUtils.js");

function getAllUser() {
  return new Promise((resolve, reject) => {
    const connection = createConnection();

    const query = "SELECT id,name,email FROM users";

    connection.query(query, (error, result) => {
      if (error) {
        reject(new Error("Filed to fetch user to database"));
      } else {
        resolve(result);
      }

      connection.end();
    });
  });
}

function addUser(name, email, password) {
  return new Promise((resolve, reject) => {
    const connection = createConnection();

    hashPassword(password)
      .then((hashedPassword) => {
        const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        connection.query(query, [name, email, hashedPassword], (error, result) => {
          connection.end();

          if (error) {
            console.error("Error adding user:", error);
            reject(error);
            return;
          }

          const tokenPayload = { userId: result.insertId, name, email };

          const token = generateToken(tokenPayload);

          console.log("User added successfully!");

          resolve({ message: "User added", id: result.insertId, token });
        });
      })

      .catch((err) => {
        console.error("Error hashing password", err);
        reject(new Error("Failed to add user"));
      });
  });
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    const connection = createConnection();

    const query = "SELECT id,name,email FROM users WHERE id = ?";

    connection.query(query, [id], (error, result) => {
      if (error) {
        reject(new Error("filed to fetch user"));
      } else {
        if (result.length === 0) {
          resolve("User not found");
        } else {
          resolve(result[0]);
        }
      }

      connection.end();
    });
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const connection = createConnection();

    const query = "SELECT id,name,email FROM users WHERE email = ?";

    connection.query(query, [email], (error, result) => {
      if (error) {
        reject(new Error("Filed to fetch user"));
      } else if (result.length === 0) {
        reject(new Error("User not found"));
      } else {
        resolve(result[0]);
      }

      connection.end();
    });
  });
}

function updateUserById(id, name, email, password) {
  return new Promise((resolve, reject) => {
    const connection = createConnection();

    hashPassword(password)
      .then((hashedPassword) => {
        const query = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";

        connection.query(query, [name, email, hashedPassword, id], (error, result) => {
          console.log(result);
          if (error) {
            console.error(error);
            reject(new Error("Filed to update users"));
          } else if (result.affectedRows === 0) {
            reject(new Error("User not found"));
          } else {
            const tokenPayload = { userId: id, name, email, };

            const token = generateToken(tokenPayload);

            console.log("User update succesfully");

            resolve({ message: "User updated", id: result.insertId, token });
          }

          connection.end();
        });
      })
      
      .catch((err) => {
        console.error("Error hashing password", err);
        reject(new Error("Failed to add user"));
      })
  });
}

function deleteUserById(id) {
  return new Promise((resolve, reject) => {
    const connection = createConnection();

    const query = "DELETE FROM users WHERE id = ?";

    connection.query(query, [id], (error, result) => {
      if (error) {
        reject(new Error("Filed to delete users"));
      } else if (result.affectedRows === 0) {
        reject(new Error("User not found"));
      } else {
        resolve({ message: "User deleted" });
      }

      connection.end();
    });
  });
}

module.exports = {
  getAllUser,
  addUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByEmail,
};
