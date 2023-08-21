const { createConnection } = require("./utils/dbUtils.js");
const { hashPassword } = require("./utils/bcryptUtils.js");
const { generateToken } = require("./utils/jwtUtils.js");
const { queries } =  require("./utils/queriesUtils.js")

const connection = createConnection();

function getAllUser() {
  return new Promise((resolve, reject) => {

    const query = queries.getAllUsers;

    connection.query(query, (error, result) => {
      if (error) {
        reject(new Error("Filed to fetch user to database"));
      } else {
        resolve(result);
      }
    });
  });
}

function addUser(name, email, password) {
  return new Promise((resolve, reject) => {

    hashPassword(password)
      .then((hashedPassword) => {
        const query = queries.addUser;

        connection.query(query, [name, email, hashedPassword], (error, result) => {

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

    const query = queries.getUserById;

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
    });
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {

    const query = queries.getUserByEmail;

    connection.query(query, [email], (error, result) => {
      if (error) {
        reject(new Error("Filed to fetch user"));
      } else if (result.length === 0) {
        reject(new Error("User not found"));
      } else {
        resolve(result[0]);
      }
    });
  });
}

function updateUserById(id, name, email, password) {
  return new Promise((resolve, reject) => {

    hashPassword(password)
      .then((hashedPassword) => {
        const query = queries.updateUserById;

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

    const query = queries.deleteUserById

    connection.query(query, [id], (error, result) => {
      if (error) {
        reject(new Error("Filed to delete users"));
      } else if (result.affectedRows === 0) {
        reject(new Error("User not found"));
      } else {
        resolve({ message: "User deleted" });
      }
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
