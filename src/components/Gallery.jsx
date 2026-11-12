import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ZoomIn } from 'lucide-react';
import Masonry from 'react-masonry-css';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/plugins/counter.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const Gallery = () => {
  const validIds = [3, 16, 21, 29, 36, 49, 57, 83, 133, 162, 172, 178, 187, 206];

  const images = validIds.map(id => ({
    id,
    src: `/images/G_M-${id}.webp`,
    alt: `Pré Wedding Gustavo e Michele ${id}`
  }));

  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Breakpoints para colunas responsivas do Masonry
  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="masonry-page">
      <div className="container">
        <header className="gallery-header">
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

        {/* Masonry Grid Real */}
        <Masonry
          breakpointCols={breakpointColumns}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className="masonry-photo-card"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="masonry-photo-img"
              />
              <div className="masonry-photo-overlay">
                <span className="masonry-photo-badge">
                  <ZoomIn size={16} /> Visualizar
                </span>
              </div>
            </div>
          ))}
        </Masonry>
      </div>

      {/* Lightbox Profissional (Touch swipe, zoom, thumbnails, counter) */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={images}
        plugins={[Zoom, Counter, Thumbnails]}
        animation={{ fade: 250, swipe: 250 }}
        carousel={{ finite: false, preload: 2 }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.5,
          doubleTapDelay: 300
        }}
        thumbnails={{
          position: 'bottom',
          width: 80,
          height: 60,
          border: 2,
          borderRadius: 6,
          padding: 2,
          gap: 12
        }}
        counter={{
          container: {
            style: { top: 'unset', bottom: 16, left: 24 }
          }
        }}
      />
    </div>
  );
};

export default Gallery;
