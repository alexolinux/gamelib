import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Gamelib
      </Link>
      <nav>
        <Link to="/games" className="hover:text-gray-400">
          Galeria de Jogos
        </Link>
        {/* Você pode adicionar outros links aqui no futuro */}
      </nav>
    </header>
  );
};

export default Header;
