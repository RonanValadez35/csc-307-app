// backend.js
import express from "express";
import cors from "cors";

const users = {
  users_list: [
    { id: "xyz789", name: "Charlie", job: "Janitor" },
    { id: "abc123", name: "Mac",     job: "Bouncer" },
    { id: "ppp222", name: "Mac",     job: "Professor" },
    { id: "yat999", name: "Dee",     job: "Aspring actress" },
    { id: "zap555", name: "Dennis",  job: "Bartender" }
  ]
};

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// --- Helpers ---
const findUserByName = (name) =>
  users.users_list.filter((user) => user.name === name);

const findUsersByJob = (job) =>
  users.users_list.filter((user) => user.job === job);

const findUsersByNameAndJob = (name, job) =>
  users.users_list.filter((user) => user.name === name && user.job === job);

const findUserById = (id) =>
  users.users_list.find((user) => user.id === id);

const addUser = (user) => {
  users.users_list.push(user);
  return user;
};

const removeUserById = (id) => {
  const idx = users.users_list.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  users.users_list.splice(idx, 1);
  return true;
};


const generateId = () => {
    const id = Math.random();
    return id;
};
// --- Routes ---
app.get("/users", (req, res) => {
  const { name, job } = req.query;

  let result;
  if (name && job) {
    result = findUsersByNameAndJob(name, job);
  } else if (name) {
    result = findUserByName(name);
  } else if (job) {
    result = findUsersByJob(job);
  } else {
    return res.send(users);
  }

  res.send({ users_list: result });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const result = findUserById(id);
  if (!result) return res.status(404).send("Resource not found.");
  res.send(result);
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    userToAdd.id = String(generateId());       
    addUser(userToAdd);
    res.status(201).json(userToAdd);   // return the full user object as JSON
  });

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const deleted = removeUserById(id);
  if (!deleted) return res.status(404).send("Resource not found.");
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
