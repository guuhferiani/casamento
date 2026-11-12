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
    <div className="album-page">
      <div className="album-container">
        <header className="album-header">
          <Link to="/" className="album-back-link">
            <ArrowLeft size={18} /> Voltar para o Início
          </Link>
          <div className="album-title-box">
            <span className="album-subtitle">Para Sempre</span>
            <h1 className="logo-text album-title">Nossa Galeria</h1>
            <p className="album-desc">
              Depois de tantos passos lindos juntos, decidimos seguir o mesmo caminho para todo sempre!
            </p>
            <p className="album-desc">
              Queremos celebrar essa união com as pessoas que mais amamos, cercados de bons brindes, muitos sorrisos e energia positiva.
            </p>
          </div>
        </header>

        {/* Grade de Fotos (Grid 4 colunas quadrada como casamento-miriam-regi) */}
        <div className="album-grid">
          {images.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="album-card"
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="album-card-img"
              />
              <div className="album-card-overlay">
                <span className="album-badge">
                  Visualizar
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal (Exatamente o layout da referência) */}
      {activeIdx !== null && (
        <div className="album-lightbox" onClick={closeLightbox}>
          {/* Botão Fechar no canto superior direito */}
          <button
            onClick={closeLightbox}
            className="album-btn-close"
            aria-label="Fechar visualização"
          >
            <X size={22} />
          </button>

          {/* Botão Anterior */}
          <button
            onClick={handlePrev}
            className="album-btn-nav prev"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Imagem Central */}
          <div className="album-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[activeIdx].url}
              alt={images[activeIdx].alt}
              key={images[activeIdx].id}
              className="album-lightbox-img"
            />
            {/* Contador */}
            <div className="album-lightbox-counter">
              {activeIdx + 1} / {images.length}
            </div>
          </div>

          {/* Botão Próximo */}
          <button
            onClick={handleNext}
            className="album-btn-nav next"
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
