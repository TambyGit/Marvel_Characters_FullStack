import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [characters, setCharacters] = useState([]);
  const [formData, setFormData] = useState({ name: '', realName: '', universe: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all characters on mount
  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/characters');
      if (!response.ok) throw new Error('Failed to fetch characters');
      const data = await response.json();
      setCharacters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const url = editingId
      ? `http://localhost:3000/characters/${editingId}`
      : 'http://localhost:3000/characters';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to save character');
      const data = await response.json();
      if (editingId) {
        setCharacters(characters.map((c) => (c.id === editingId ? data : c)));
      } else {
        setCharacters([...characters, data]);
      }
      setFormData({ name: '', realName: '', universe: '' });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (character) => {
    setFormData({
      name: character.name,
      realName: character.realName,
      universe: character.universe,
    });
    setEditingId(character.id);

    window.scrollTo({ top: 0, behavior: 'smooth' });

  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce personnage ?");

  if (!confirmDelete) {
    return; 
  }

  try {
    const response = await fetch(`http://localhost:3000/characters/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete character');
    setCharacters(characters.filter((c) => c.id !== id));
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="background_image">
      <div className="max-w-6xl mx-auto">
        <h1 className="titre text-3xl font-bold text-center mb-8 text-white">
          Marvel Characters Manager
        </h1>

        {/* Form for adding/editing characters */}
        <form
          onSubmit={handleSubmit}
          className="gradient-form p-6 rounded-lg shadow-md mb-8"
          >
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Character' : 'Add New Character'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Character Name"
                className="border-2 border-red-500 p-2 rounded-md text-amber-50 focus:outline-none"
              required
            />
            <input
              type="text"
              name="realName"
              value={formData.realName}
              onChange={handleInputChange}
              placeholder="Real Name"
              className="border-2 border-red-500 p-2 rounded-md text-amber-50 focus:outline-none"
              required
            />
            <input
              type="text"
              name="universe"
              value={formData.universe}
              onChange={handleInputChange}
              placeholder="Universe"
              className="border-2 border-red-500 p-2 rounded-md text-amber-50 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition hover:scale-105"
          >
            {editingId ? 'Update Character' : 'Add Character'}
          </button>
          {editingId && (
            <button
            type="button"
              onClick={() => {
                setFormData({ name: '', realName: '', universe: '' });
                setEditingId(null);
              }}
              className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition hover:scale-105"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Error and Loading States */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading && <p className="text-gray-500 text-center mb-4">Loading...</p>}

        {/* Characters List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className="gradient-background border-purple-600 p-4 shadow-md hover:shadow-white transition hover:scale-110 rounded-bl-4xl rounded-tr-4xl"
              >
              <h1 className="text-2xl font-bold mb-2 text-white">{character.id}</h1>
              <h3 className="nom_hero text-lg font-bold text-gray-400">{character.name}</h3>
              <p className="text-yellow-400">Real Name: <span>{character.realName}</span></p>
              <p className="text-white">Universe: {character.universe}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(character)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition hover:scale-105"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(character.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition hover:scale-105"
                  >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;