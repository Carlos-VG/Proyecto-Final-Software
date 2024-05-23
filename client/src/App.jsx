
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/login';

function App() {
  return (
    <div>
      <Login />
      {/* Otros componentes o contenido */}
    </div>
  );
}

export default App;