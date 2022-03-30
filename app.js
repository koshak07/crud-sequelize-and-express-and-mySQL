const Sequelize = require("sequelize");
const express = require("express");

const app = express();
const urlencodedParser = express.urlencoded({ extended: false });
const sequelize = new Sequelize("userdb", "root", "141512Er!", {
  dialect: "mysql",
  host: "localhost",
  define: {
    timestamps: false,
  },
});

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

app.set("view engine", "hbs");

sequelize
  .sync()
  .then(() => {
    app.listen(3000, function () {
      console.log("Server expected connect...");
    });
  })
  .catch((err) => console.log(err));

app.get("/", function (req, res) {
  User.findAll({ raw: true })
    .then((data) => {
      res.render("index.hbs", {
        users: data,
      });
    })
    .catch((err) => console.log(err));
});

app.get("/create", function (req, res) {
  res.render("create.hbs");
});

app.post("/create", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const username = req.body.name;
  const userage = req.body.age;
  User.create({ firstname: username, age: userage })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

app.get("/edit/:id", function (req, res) {
  const userId = req.params.id;
  User.findAll({ where: { id: userId }, raw: true })
    .then((data) => {
      res.render("edit.hbs", {
        user: data[0],
      });
    })
    .catch((err) => console.log(err));
});
app.post("/edit", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const username = req.body.firstname;
  const userage = req.body.age;
  const userId = req.body.id;
  User.update({ firstname: username, age: userage }, { where: { id: userId } })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

// app.post("/delete/:id", function (req, res) {
//   const userId = req.params.id;
//   User.destroy({ where: { id: userId } })
//     .then(() => {
//       res.redirect("/");
//     })
//     .catch((err) => console.log(err));
// });
app.post("/delete/:id", function (req, res) {
  const userid = req.params.id;
  User.destroy({ where: { id: userid } })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});
