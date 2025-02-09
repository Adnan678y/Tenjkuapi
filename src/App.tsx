import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddAnime from './pages/AddAnime';
import EditAnime from './pages/EditAnime';
import AnimeList from './pages/AnimeList';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddAnime />} />
            <Route path="/edit/:id" element={<EditAnime />} />
            <Route path="/list" element={<AnimeList />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;