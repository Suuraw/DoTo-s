import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ToDoList from './pages/ToDo/ToDoList';
import './App.css';
import 'antd/dist/reset.css';

function App() {
  return (
    <Router basename="/DoTo-s">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/to-do-list" element={<ToDoList />} />
      </Routes>
    </Router>
  );
}

export default App;
