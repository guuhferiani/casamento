import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [desktopSubmenu, setDesktopSubmenu] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setDesktopSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDesktopSubmenu(null);
      setMobileSubmenu(null);

      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Nossa História', href: '#story' },
    { name: 'Cerimônia', href: '#ceremony' },
    { name: 'Galeria de Fotos', href: '/galeria', isInternal: true },
    {
      name: 'Presentes',
      href: '#',
      submenu: [
        { name: 'Lista de Mimos', href: '/lista-de-mimos', isInternal: true },
        { name: 'Lista Camicado', href: '/lista-camicado', isInternal: true }
      ]
    },
    { name: 'Confirmar Presença', href: '#rsvp', isButton: true },
  ];

  const handleNavClick = (e, href, isInternal) => {
    if (isInternal) {
      setIsOpen(false);
      return;
    }

    if (href.startsWith('#')) {
      e.preventDefault();
      if (!isHome) {
        navigate('/' + href);
      } else {
        const element = document.querySelector(href);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
      setIsOpen(false);
    }
  };

  const toggleDesktopSubmenu = (name) => {
    setDesktopSubmenu(desktopSubmenu === name ? null : name);
  };

  const toggleMobileSubmenu = (name) => {
    setMobileSubmenu(mobileSubmenu === name ? null : name);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        (scrolled || !isHome) ? 'navbar-scrolled py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
          onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}
        >
          <span
            className={`logo-text transition-colors ${
              (scrolled || !isHome) ? 'text-text-main' : 'text-white'
            }`}
          >
            G <Heart className="heart-icon" size={20} /> M
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="desktop-links items-center gap-8">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className={link.submenu ? 'relative' : ''}
            >
              {link.submenu ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDesktopSubmenu(link.name);
                    }}
                    className={`flex items-center gap-1 text-sm uppercase tracking-widest font-medium transition-all duration-300 ${
                      (scrolled || !isHome) ? 'text-text-main hover:text-primary' : 'text-white/80 hover:text-white'
                    } ${desktopSubmenu === link.name ? 'text-primary opacity-100' : ''}`}
                    aria-haspopup="true"
                    aria-expanded={desktopSubmenu === link.name}
                  >
                    {link.name}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${
                        desktopSubmenu === link.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute top-full right-0 pt-4 transition-all duration-300 z-[100] ${
                      desktopSubmenu === link.name
                        ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                        : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <ul className="dropdown-menu min-w-[200px]">
                      {link.submenu.map((sub) => (
                        <li key={sub.name}>
                          {sub.isInternal ? (
                            <Link
                              to={sub.href}
                              onClick={(e) => handleNavClick(e, sub.href, true)}
                            >
                              {sub.name}
                            </Link>
                          ) : (
                            <a
                              href={sub.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setDesktopSubmenu(null)}
                            >
                              {sub.name}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={
                    link.isButton
                      ? 'btn'
                      : `text-sm uppercase tracking-widest font-medium transition-colors ${
                          (scrolled || !isHome) ? 'text-text-main hover:text-primary' : 'text-white/80 hover:text-white'
                        }`
                  }
                >
                  {link.name}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => {
            setIsOpen(!isOpen);
            if (isOpen) setMobileSubmenu(null);
          }}
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <X className={(scrolled || !isHome) ? 'text-text-main' : 'text-white'} size={28} />
          ) : (
            <Menu className={(scrolled || !isHome) ? 'text-text-main' : 'text-white'} size={28} />
          )}
        </button>

      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu flex-col items-center justify-center transition-all duration-300 ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <button
          className="absolute top-8 right-8 close-btn"
          onClick={() => {
            setIsOpen(false);
            setMobileSubmenu(null);
          }}
          aria-label="Close Menu"
        >
          <X className="text-text-main" size={32} />
        </button>

        <div className="flex flex-col items-center gap-4 w-full max-w-xs overflow-y-auto max-h-[70vh] py-4">
          {navLinks.map((link) => (
            <div key={link.name} className="w-full flex flex-col items-center">
              {link.submenu ? (
                <>
                  <button
                    onClick={() => toggleMobileSubmenu(link.name)}
                    className="w-full flex items-center justify-center gap-2 py-4 border-bottom text-2xl font-serif uppercase tracking-widest"
                  >
                    {link.name}
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        mobileSubmenu === link.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`flex flex-col items-center w-full transition-all duration-300 overflow-hidden ${
                      mobileSubmenu === link.name ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {link.submenu.map((sub) => (
                      sub.isInternal ? (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className="text-lg py-2 text-text-muted hover:text-primary"
                          onClick={(e) => handleNavClick(e, sub.href, true)}
                        >
                          {sub.name}
                        </Link>
                      ) : (
                        <a
                          key={sub.name}
                          href={sub.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg py-2 text-text-muted hover:text-primary"
                          onClick={() => {
                            setIsOpen(false);
                            setMobileSubmenu(null);
                          }}
                        >
                          {sub.name}
                        </a>
                      )
                    ))}
                  </div>
                </>
              ) : (
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={
                    link.isButton
                      ? 'btn w-full text-center mt-4'
                      : 'w-full text-center py-4 border-bottom text-2xl font-serif uppercase tracking-widest'
                  }
                >
                  {link.name}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;