import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Games from './pages/Games'; // Importe a nova página

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main className="p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} /> {/* Adicione a nova rota */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
