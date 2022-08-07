require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const EmployeeModel = require("./models/Employee");

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DABABASE_URL, {
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  res.send("api is running");
});

// GET all employees
app.get("/api/read", (req, res) => {
  EmployeeModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// ADD an employee
app.post("/api/create", async (req, res) => {
  const { name, age } = req.body;
  const employee = new EmployeeModel({ name: name, age: age });
  try {
    await employee.save();
    res.send(employee);
  } catch (error) {
    // res.send(error);
    console.log(error);
  }
});

// UPDATE an employee
app.put("/api/update/:id", async (req, res) => {
  const id = req.params.id;
  const { name, age } = req.body;
  try {
    await EmployeeModel.findById(id, (err, updatedEmployee) => {
      updatedEmployee.name = name;
      updatedEmployee.age = age;
      updatedEmployee.save();
      res.send(updatedEmployee);
    });
  } catch (error) {
    // res.send(error);
    console.log(error);
  }
});

// DELETE an employee
app.delete("/api/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await EmployeeModel.findByIdAndRemove(id).exec();
    res.send("deleted");
  } catch (error) {
    // res.send(error);
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
