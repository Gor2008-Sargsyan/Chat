const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { hashPass, comparePass } = require("../utils/bcrypt")
const uuid = require("uuid");
require("dotenv").config();

const usersFilePath = path.join(__dirname, "../../public/users.json");
const JWT_SECRET_KEY = process.env.MY_CUSTOM_SECRET_KEY

const passwordValidate = (password) => {
  const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,_-]).{8,}$/;
  return valid.test(password);
};

const signup = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  console.log(username, password, confirmPassword);

  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error!" })
    }
    let users = []

    if (data) {
      users = JSON.parse(data)
    }

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      const msg = "Username already exists!"
      const status = "fail"
      return res.status(400).redirect(`/signup.html?message=${msg}&status=${status}`)
    }

    if (!passwordValidate(password)) {
      const successMessage = 'Password must consist of at least 8 characters and contain at least one capital letter and some symbol (. , - , _ , ...), must contain lowercase letters and numbers.';
      const status = 'fail';
      return res
        .status(400)
        .redirect(`/signup.html?message=${successMessage}&status=${status}`);
    }

    if(password === confirmPassword) {
      hashPass(password).then((bcryptedPassword) => {
        const token = jwt.sign({ username }, JWT_SECRET_KEY);
        console.log('token', token);
        const id = uuid.v4();
        console.log('id', id);
  
        const newUser = { id, username, password: bcryptedPassword, token };
        users.push(newUser);
  
        fs.writeFile(usersFilePath, JSON.stringify(users), 'utf-8', (error) => {
          if (error) {
            return res.status(500).json({ message: "Internal server error" })
          }
  
          const status = 'success';
          const successMessage = "User registered successfully!";
          return res
            .status(201)
            .redirect(`/index.html?message=${successMessage}&status=${status}`) 
        })
      }) .catch((err) => {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" })
      })
    } else {
      const successMessage = 'Passwords do not match. Please enter the same password in the Confirm Password field to confirm your password.';
      const status = 'fail';
      return res
        .status(400)
        .redirect(`/signup.html?message=${successMessage}&status=${status}`);
    }
    
  })
}

const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const room = req.body.room;
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if(err) {
      console.log(err);
      return res.status(500).json({ message: "Interval server error!"})
    }
    let users = []
    if(data) {
      users = JSON.parse(data)
    }
    const user = users.find((user) => {return user.username === username})

    if (user) {
      comparePass(password, user.password).then((match) => {
        if (match) {
          const token = jwt.sign({ username, room}, JWT_SECRET_KEY)
          return res.status(200).redirect(`/chat.html?token=${token}`);
        } else {
          return res.status(400).redirect(`/?message=Incorrect Password&status=fail`)
        }
      }).catch((err) => {
        return res.status(500).json({ message: err })
      })
      } else {
        return res.status(400).redirect(`/?message=Username Does not exist&status=fail`)
      }
  })
}

module.exports = { signup, login }
