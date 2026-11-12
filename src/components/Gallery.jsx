import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Lista exata de IDs das fotos que existem na pasta /public/images/
  // Isso evita 404s desnecessários e melhora muito a performance online
  const validIds = [3, 16, 21, 29, 36, 49, 57, 83, 133, 162, 172, 178, 187, 206];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Bloqueia a rolagem da página quando o modal da foto estiver aberto
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  const images = validIds.map(id => ({
    id,
    url: `/images/G_M-${id}.webp`,
    alt: `Pré Wedding Gustavo e Michele ${id}`
  }));

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

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

        <div className="masonry-grid">
          {images.map((img) => (
            <div
              key={img.id}
              className="masonry-item"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
              />
              <div className="item-overlay">
                <ZoomIn size={32} color="white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <button className="gallery-close-btn" onClick={() => setSelectedImage(null)} title="Fechar">
            <X size={26} />
          </button>

          <div className="gallery-modal" onClick={e => e.stopPropagation()}>
            <button className="nav-btn prev" onClick={handlePrev} title="Foto anterior">
              <ChevronLeft size={36} />
            </button>

            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              key={selectedImage.id}
              className="animate-fade-in"
            />

            <button className="nav-btn next" onClick={handleNext} title="Próxima foto">
              <ChevronRight size={36} />
            </button>

            <div className="image-counter">
              {images.findIndex(img => img.id === selectedImage.id) + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
