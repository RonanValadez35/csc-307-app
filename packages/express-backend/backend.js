// backend.js
import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET /users?name=&job=
app.get("/users", (req, res) => {
  const { name, job } = req.query;
  userServices
    .getUsers(name, job)
    .then((docs) => {
      // keep same shape as before: { users_list: [...] }
      res.json({ users_list: docs });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// GET /users/:id
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  userServices
    .findUserById(id)
    .then((doc) => {
      if (!doc) return res.status(404).send("Resource not found.");
      res.json(doc);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// POST /users
app.post("/users", (req, res) => {
  const userToAdd = req.body; // { name, job }
  userServices
    .addUser(userToAdd)
    .then((saved) => {
      // 201 + return newly created object (now includes _id)
      res.status(201).json(saved);
    })
    .catch((err) => {
      console.error(err);
      // if validation error from Mongoose, return 400
      if (err?.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).send("Internal Server Error");
    });
});

// DELETE /users/:id
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  userServices
    .removeUserById(id)
    .then((deleted) => {
      if (!deleted) return res.status(404).send("Resource not found.");
      res.status(204).send();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});