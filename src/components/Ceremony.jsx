import React from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';

const Ceremony = () => {
  return (
    <section id="ceremony" className="ceremony">
      <div className="container">
        <div className="section-title">
          <p>O Grande Dia</p>
          <h2>Cerimônia e Recepção</h2>
        </div>

        <div className="ceremony-container">
          <div className="ceremony-card">
            <div className="card-image">
              <img src="/images/hall.png" alt="Local da Cerimônia" />
            </div>
            <div className="card-content">
              <h3>Salão de Festas</h3>
              <div className="info-list">
                <div className="info-item">
                  <Calendar className="icon" />
                  <div>
                    <strong>Data</strong>
                    <p>06 de Junho de 2026</p>
                  </div>
                </div>
                <div className="info-item">
                  <Clock className="icon" />
                  <div>
                    <strong>Horário</strong>
                    <p>19:00 - Recepção</p>
                  </div>
                </div>
                <div className="info-item">
                  <MapPin className="icon" />
                  <div>
                    <strong>Local</strong>
                    <p>R. Elói Cerqueira, 287 - Belém, São Paulo - SP</p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=R.+Elói+Cerqueira,+287+-+Belem,+São+Paulo+-+SP" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="map-link"
                    >
                      Ver no Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ceremony;
