import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const targetDate = new Date('2026-06-06T00:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [isWeddingDay, setIsWeddingDay] = useState(false);

  useEffect(() => {
    // Verificar se já é o dia do casamento (06/06/2026) ou posterior
    const checkWeddingDay = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // getMonth() é 0-indexed
      const date = now.getDate();

      if (year > 2026 || (year === 2026 && month > 6) || (year === 2026 && month === 6 && date >= 6)) {
        setIsWeddingDay(true);
      }
    };

    checkWeddingDay();
    const dateInterval = setInterval(checkWeddingDay, 30000); // Verifica a cada 30s

    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => {
      clearInterval(dateInterval);
      clearInterval(countdownInterval);
    };
  }, [targetDate]);

  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content container">
        <h1 className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Gustavo <Heart className="heart-icon text-white" size={50} /> Michele
        </h1>

        {isWeddingDay ? (
          <div className="wedding-day-message animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="wedding-hearts">
              <Heart className="heart-pulse text-white mx-1" size={40} fill="white" />
              <Heart className="heart-pulse-delayed text-white mx-1" size={24} fill="white" />
            </div>
            <h2 className="celebration-title">Chegou o Nosso Grande Dia!</h2>
            <p className="celebration-subtitle">06 de Junho de 2026</p>
            
            <div className="hero-action-buttons">
              <a href="#ceremony" className="btn">
                Como Chegar (GPS)
              </a>
              <Link to="/mural" className="btn btn-primary-highlight">
                Mural de Fotos
              </Link>
              <Link to="/mensagens" className="btn">
                Deixar Mensagem
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="countdown animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="time-box">
                <span>{Math.max(0, timeLeft.days)}</span>
                <p>Dias</p>
              </div>
              <div className="time-box">
                <span>{Math.max(0, timeLeft.hours)}</span>
                <p>Horas</p>
              </div>
              <div className="time-box">
                <span>{Math.max(0, timeLeft.minutes)}</span>
                <p>Minutos</p>
              </div>
              <div className="time-box">
                <span>{Math.max(0, timeLeft.seconds)}</span>
                <p>Segundos</p>
              </div>
            </div>
            <a href="#rsvp" className="btn animate-fade-in" style={{ animationDelay: '0.8s' }}>Confirmar Presença</a>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .wedding-day-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 35px;
          margin-bottom: 35px;
          width: 100%;
        }
        
        .wedding-hearts {
          display: flex;
          align-items: flex-end;
          margin-bottom: 15px;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }

        .heart-pulse {
          animation: pulse 1.6s infinite ease-in-out;
        }

        .heart-pulse-delayed {
          animation: pulse 1.6s infinite ease-in-out;
          animation-delay: 0.4s;
          opacity: 0.8;
        }

        .celebration-title {
          font-family: 'DK Midnight Chalker', sans-serif !important;
          font-size: 3.8rem !important;
          font-weight: 300;
          margin-bottom: 8px !important;
          text-transform: none;
          letter-spacing: 1px;
          text-shadow: 0 4px 10px rgba(0,0,0,0.3);
          color: white;
        }

        .celebration-subtitle {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 4px;
          margin-bottom: 35px;
          opacity: 0.95;
          font-weight: 600;
          color: white;
        }

        .hero-action-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          width: 100%;
          max-width: 800px;
          flex-wrap: wrap;
        }

        .hero-action-buttons .btn {
          min-width: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-primary-highlight {
          background-color: white !important;
          color: black !important;
          border-color: white !important;
        }

        .btn-primary-highlight:hover {
          background-color: transparent !important;
          color: white !important;
          border-color: white !important;
        }

        @media (max-width: 768px) {
          .celebration-title {
            font-size: 2.2rem !important;
            line-height: 1.2;
          }
          
          .hero-action-buttons {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
            padding: 0 15px;
          }

          .hero-action-buttons .btn {
            width: 100%;
            min-width: auto;
            padding: 12px 20px;
          }
        }
      `}} />
    </section>
  );
};

export default Hero;
