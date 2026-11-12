import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const validIds = [3, 16, 21, 29, 36, 49, 57, 83, 133, 162, 172, 178, 187, 206];

  const images = validIds.map(id => ({
    id,
    url: `/images/G_M-${id}.webp`,
    alt: `Pré Wedding Gustavo e Michele ${id}`
  }));

  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openLightbox = (index) => {
    setActiveIdx(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setActiveIdx(null);
    document.body.style.overflow = '';
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeIdx === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx]);

  return (
    <div className="gallery-page animate-fade-in">
      <div className="container">
        <header className="gallery-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} /> Voltar para o Início
          </Link>
          <div className="section-title">
            <p>Para Sempre</p>
            <h2 className="logo-text">Nossa Galeria</h2>
            <p className="description">Depois de tantos passos lindos juntos, decidimos seguir o mesmo caminho para todo sempre!</p>
            <p className="description">Queremos celebrar essa união com as pessoas que mais amamos, cercados de bons brindes, muitos sorrisos e energia positiva.</p>
          </div>
        </header>

        {/* Gallery Grid elegante e responsiva */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="group aspect-square overflow-hidden rounded-2xl bg-gray-100 cursor-pointer relative shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-sans text-xs uppercase tracking-wider font-medium bg-black/80 px-4 py-2 rounded-full shadow-sm">
                  Visualizar
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal idêntico ao padrão funcional do casamento-miriam-regi */}
      {activeIdx !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 z-[100002]"
            aria-label="Fechar visualização"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 z-[100002] active:scale-95"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Active Image Container */}
          <div className="max-w-4xl max-h-[80vh] flex items-center justify-center relative select-none">
            <img
              src={images[activeIdx].url}
              alt={images[activeIdx].alt}
              key={images[activeIdx].id}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Image Counter */}
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/70 font-sans text-sm font-light tracking-widest">
              {activeIdx + 1} / {images.length}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 z-[100002] active:scale-95"
            aria-label="Próxima foto"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
