import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const Hero = () => {
  const targetDate = new Date('2026-06-06T00:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content container">
        <h1 className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Gustavo <Heart className="heart-icon text-white" size={50} /> Michele
        </h1>
        <div className="countdown animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="time-box">
            <span>{timeLeft.days}</span>
            <p>Dias</p>
          </div>
          <div className="time-box">
            <span>{timeLeft.hours}</span>
            <p>Horas</p>
          </div>
          <div className="time-box">
            <span>{timeLeft.minutes}</span>
            <p>Minutos</p>
          </div>
          <div className="time-box">
            <span>{timeLeft.seconds}</span>
            <p>Segundos</p>
          </div>
        </div>
        <a href="#rsvp" className="btn animate-fade-in" style={{ animationDelay: '0.8s' }}>Confirmar Presença</a>
      </div>
    </section>
  );
};

export default Hero;
