import React, { useState, useEffect } from 'react';
import api from '../api';

const AddConsole = ({ onConsoleAdded, onClose }) => {
  const [name, setName] = useState('');
  const [rawgId, setRawgId] = useState('');
  const [rawgPlatforms, setRawgPlatforms] = useState([]);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await api.get('/consoles/rawg-platforms');
        setRawgPlatforms(response.data);
      } catch (error) {
        console.error('Error fetching RAWG platforms:', error);
      }
    };
    fetchPlatforms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/consoles', { name, rawgId: rawgId || null });
      alert('Console added successfully!');
      onConsoleAdded();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding console');
    }
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const selectedPlatform = rawgPlatforms.find(p => p.id == selectedId);
    if (selectedPlatform) {
      setName(selectedPlatform.name);
      setRawgId(selectedPlatform.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Console</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={isManual}
                onChange={(e) => setIsManual(e.target.checked)}
              />
              <span className="ml-2">Add manually</span>
            </label>
          </div>
          <div className="mb-4">
            {isManual ? (
              <>
                <label className="block mb-2">Console Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  required
                />
              </>
            ) : (
              <>
                <label className="block mb-2">Select RAWG Console</label>
                <select
                  value={rawgId}
                  onChange={handleSelectChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  required
                >
                  <option value="">Select a console...</option>
                  {rawgPlatforms.map(platform => (
                    <option key={platform.id} value={platform.id}>{platform.name}</option>
                  ))}
                </select>
              </>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 rounded">
            Add Console
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddConsole;
