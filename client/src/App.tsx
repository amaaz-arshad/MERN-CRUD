// @ts-nocheck
import React, { FormEvent, useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import apiURL from "./config";

interface Employee {
  _id: number;
  name: string;
  age: string;
}

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [employeeList, setEmployeeList] = useState<Employee>([]);
  const [editId, setEditId] = useState(-1);

  useEffect(() => {
    axios
      .get(`${apiURL}/api/read`)
      .then((response) => {
        console.log(response);
        setEmployeeList(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const addEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("button clicked");
    console.log(name, age);

    axios
      .post(`${apiURL}/api/create`, {
        name,
        age,
      })
      .then((response) => {
        console.log(response);
        setName("");
        setAge("");
        setEmployeeList([...employeeList, response.data]);
        // alert("Employee Added successfully");
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  };

  const deleteEmployee = (id: number, index: number) => {
    axios
      .delete(`${apiURL}/api/delete/${id}`)
      .then((response) => {
        console.log(response);
        const list = [...employeeList];
        list.splice(index, 1);
        setEmployeeList(list);
        setEditMode(false);
        setName("");
        setAge("");
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  const updateEmployee = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    console.log("edit button click");
    console.log(id, name, age);
    axios
      .put(`${apiURL}/api/update/${id}`, {
        name,
        age,
      })
      .then((response) => {
        console.log(response);
        for (const emp of employeeList) {
          if (emp._id === editId) {
            emp.name = name;
            emp.age = age;
          }
        }
        setEditMode(false);
        setName("");
        setAge("");
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  return (
    <div className="container">
      <h4 className="mt-4 text-center">Employee Form</h4>
      <form className="formstyle">
        <input
          className="form-control"
          type="text"
          placeholder="Enter employee name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <input
          className="form-control"
          type="number"
          placeholder="Enter employee age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <br />
        {editMode ? (
          <button
            onClick={(e) => updateEmployee(e, editId)}
            className="form-control btn btn-secondary"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={addEmployee}
            className="form-control btn btn-primary"
          >
            Add
          </button>
        )}
      </form>

      <h4 className="mt-4 mb-4 text-center">Employee Data</h4>
      <table className="table">
        <thead className="table-dark">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map((emp, index) => (
            <tr key={index}>
              <td scope="row">{emp._id}</td>
              <td>{emp.name}</td>
              <td>{emp.age}</td>
              <td>
                <button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={() => {
                    setEditMode(true);
                    setName(emp.name);
                    setAge(emp.age);
                    setEditId(emp._id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => deleteEmployee(emp._id, index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
