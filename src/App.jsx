import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Story from './components/Story';
import Ceremony from './components/Ceremony';
import RSVP from './components/RSVP';

import BackToTop from './components/BackToTop';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Story />
        <Ceremony />
        <RSVP />
      </main>
      
      <BackToTop />
      
      <footer className="footer">
        <div className="container">
          <p className="font-serif">G & M</p>
          <p className="date">06.06.2026</p>
          <div className="divider"></div>
          <p className="made-with">Feito com carinho para o nosso grande dia</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
