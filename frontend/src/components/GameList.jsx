import React from 'react';

const GameList = ({ consoles, onConsoleSelect, onConsoleDelete, selectedConsoleId }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Consoles</h2>
      <button
        onClick={() => onConsoleSelect(null)}
        className={`w-full text-left p-3 rounded-lg mb-2 transition-colors duration-200 
          ${selectedConsoleId === null ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
      >
        All Games
      </button>
      <ul>
        {consoles.map(consoleItem => (
          <li key={consoleItem._id} className="flex justify-between items-center mb-2">
            <button
              onClick={() => onConsoleSelect(consoleItem._id)}
              className={`flex-grow text-left p-3 rounded-lg transition-colors duration-200 
                ${selectedConsoleId === consoleItem._id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {consoleItem.name}
            </button>
            <button
              onClick={() => onConsoleDelete(consoleItem._id)}
              className="ml-2 px-3 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
              title="Delete Console"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
