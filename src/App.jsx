import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Story from './components/Story';
import Ceremony from './components/Ceremony';
import RSVP from './components/RSVP';
import Gifts from './components/Gifts';
import Camicado from './components/Camicado';
import Gallery from './components/Gallery';
import BackToTop from './components/BackToTop';

const Home = () => (
  <>
    <Hero />
    <Story />
    <Ceremony />
    <RSVP />
  </>
);

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lista-de-mimos" element={<Gifts />} />
            <Route path="/lista-camicado" element={<Camicado />} />
            <Route path="/galeria" element={<Gallery />} />
          </Routes>
        </main>
        
        <BackToTop />
        
        <footer className="footer">
          <div className="container">
            <p className="logo-text">G <Heart className="heart-icon" size={20} /> M</p>
            <p className="date">06.06.2026</p>
            <div className="divider"></div>
            <p className="made-with">Feito por nós com carinho para o nosso grande dia</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
