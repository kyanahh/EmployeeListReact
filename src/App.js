import React, { useState, useEffect } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import "firebase/database";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table } from "react-bootstrap";

const firebaseConfig = {
  apiKey: "AIzaSyCbWW2GIA0-qDWPizsz_C7YtuD44j8MmFY",
  authDomain: "employee-list-52dad.firebaseapp.com",
  databaseURL: "https://employee-list-52dad-default-rtdb.firebaseio.com",
  projectId: "employee-list-52dad",
  storageBucket: "employee-list-52dad.appspot.com",
  messagingSenderId: "837732742073",
  appId: "1:837732742073:web:5e1298847ae217caf37c68"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("employees");

function App() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [employees, setEmployees] = useState([]);
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  useEffect(() => {
    db.on("value", (snapshot) => {
      const data = snapshot.val();
      const employeesArray = [];
      for (let id in data) {
        employeesArray.push({ id, ...data[id] });
      }
      setEmployees(employeesArray);
    });
  }, []);  

  const handleSave = (e) => {
    e.preventDefault();
    if (editEmployeeId === null) {
      const newEmployee = {
        lastName,
        firstName,
        email,
      };
      db.push(newEmployee);
    } else {
      const updatedEmployee = {
        lastName,
        firstName,
        email,
      };
      db.child(editEmployeeId).update(updatedEmployee);
      setEditEmployeeId(null);
    }
    setLastName("");
    setFirstName("");
    setEmail("");
  };

  const handleUpdate = (id) => {
    if (id === null) {
      return;
    }
    const updatedEmployee = {
      lastName,
      firstName,
      email,
    };
    db.child(editEmployeeId).update(updatedEmployee, (error) => {
      if (error) {
        console.log(error);
      } else {
        const updatedEmployees = employees.map((employee) => {
          if (employee.id === editEmployeeId) {
            return { id: editEmployeeId, ...updatedEmployee };
          }
          return employee;
        });
        setEmployees(updatedEmployees);
        setLastName("");
        setFirstName("");
        setEmail("");
        setEditEmployeeId(null);
      }
    });
  };
  

  const handleEdit = (id) => {
    const employeeToUpdate = employees.find((employee) => employee.id === id);
    setLastName(employeeToUpdate.lastName);
    setFirstName(employeeToUpdate.firstName);
    setEmail(employeeToUpdate.email);
    setEditEmployeeId(id);
  };

  const handleDelete = (id) => {
    db.child(id).remove();
  };

  return (
    <div className="container mt-5 card" style={{ height: "530px", width: "1300px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)" }}>
    <div className="mt-5">
      <h1 className="d-flex justify-content-center h2 mb-5">Employees List</h1>
      <form onSubmit={editEmployeeId ? handleUpdate : handleSave} className="form-inline">
      <div className="row d-flex justify-content-center">
      <div className="col-auto">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      </div>
      <div className="col-auto">
      <div className="form-group ml-2">
        <input
          type="text"
          className="form-control"
          placeholder="First Name"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      </div>
      <div className="col-auto">
      <div className="form-group ml-2">
        <input
          type="email"
          className="form-control"
          placeholder="Email address"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      </div>
      <div className="col-auto">
      <button type="submit" className="btn btn-primary ml-2 mx-2">
        {editEmployeeId ? "Update" : "Add Employee"}
      </button>
      {editEmployeeId && (
        <button
          type="button"
          className="btn btn-secondary ml-2"
          onClick={() => {
            setLastName("");
            setFirstName("");
            setEmail("");
            setEditEmployeeId(null);
          }}
        >
          Cancel
        </button>
      )}
      </div>
      </div>
      </form>
      <div className="table-responsive mt-4" style={{ height: "300px", overflowY: "scroll" }}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.lastName}</td>
                <td>{employee.firstName}</td>
                <td>{employee.email}</td>
                <td>
                <Button variant="warning" className="mr-2" onClick={() => handleEdit(employee.id)}>
                Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(employee.id)}>
                Delete
                </Button>
                </td>
            </tr>
            ))}
          </tbody>
        </Table>
        </div>
        </div>
        </div>
        );
        }

export default App;