import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [allIds] = useState(Array.from({ length: 185 }, (_, i) => i + 3));
  const [validImages, setValidImages] = useState([]);

  const handleImageError = (id) => {
    setValidImages(prev => prev.filter(imgId => imgId !== id));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setValidImages(allIds);
  }, []);

  const images = validImages.map(id => ({
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
            <p className="description">Momentos especiais do nosso ensaio Pre Wedding, capturando a essência do nosso amor.</p>
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
                onError={() => handleImageError(img.id)} 
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
          <div className="gallery-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedImage(null)}>
              <X size={32} />
            </button>
            
            <button className="nav-btn prev" onClick={handlePrev}>
              <ChevronLeft size={48} />
            </button>
            
            <img 
              src={selectedImage.url} 
              alt={selectedImage.alt} 
              key={selectedImage.id}
              className="animate-fade-in"
            />
            
            <button className="nav-btn next" onClick={handleNext}>
              <ChevronRight size={48} />
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
