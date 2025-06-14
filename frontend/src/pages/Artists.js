import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Albums from './pages/Albums';
import Artists from './pages/Artists';
import AlbumDetail from './pages/AlbumDetail';
import ArtistDetail from './pages/ArtistDetail';
import AddReview from './pages/AddReview';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/albums/:id" element={<AlbumDetail />} />
            <Route path="/artists/:id" element={<ArtistDetail />} />
            <Route path="/albums/:id/review" element={<AddReview />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;