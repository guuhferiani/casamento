import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Nossa História', href: '#story' },
    { name: 'Cerimônia', href: '#ceremony' },
    { name: 'Presentes', href: '#gifts' },
    { name: 'Confirmar Presença', href: '#rsvp', isButton: true },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'navbar-scrolled py-4' : 'bg-transparent py-6'}`}>
      <div className="container flex justify-between items-center">
        <a href="#home" className="flex items-center gap-2 group">
          <Heart className={`w-6 h-6 ${scrolled ? 'text-primary' : 'text-white'}`} fill={scrolled ? '#1A1A1A' : 'none'} />
          <span className={`text-xl font-serif tracking-widest uppercase transition-colors ${scrolled ? 'text-text-main' : 'text-white'}`}>G & M</span>
        </a>

        {/* Desktop Menu */}
        <ul className="desktop-links items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={link.isButton ? 'btn' : `text-sm uppercase tracking-widest font-medium transition-colors ${scrolled ? 'text-text-main hover:text-primary' : 'text-white/80 hover:text-white'}`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle Button */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? (
            <X className={scrolled ? 'text-text-main' : 'text-white'} size={28} />
          ) : (
            <Menu className={scrolled ? 'text-text-main' : 'text-white'} size={28} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu flex-col items-center justify-center transition-all duration-300 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
        <button className="absolute top-8 right-8" onClick={() => setIsOpen(false)} aria-label="Close Menu">
          <X className="text-text-main" size={32} />
        </button>
        
        <div className="flex flex-col items-center gap-6 w-full max-w-xs">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={link.isButton ? 'btn w-full text-center mt-4' : ''}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
