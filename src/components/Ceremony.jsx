import React from 'react';
import { MapPin, Clock, Calendar, Shirt } from 'lucide-react';

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
              <img src="/images/G_M-133.webp" alt="Local da Cerimônia" />
            </div>
            <div className="card-content">
              <div className="info-list">
                <div className="info-item">
                  <Calendar className="icon" />
                  <div>
                    <strong>Data</strong>
                    <p>06.06.2026</p>
                  </div>
                </div>
                <div className="info-item">
                  <Clock className="icon" />
                  <div>
                    <strong>Horário</strong>
                    <p>13h</p>
                  </div>
                </div>
                <div className="info-item">
                  <Shirt className="icon" />
                  <div>
                    <strong>Traje</strong>
                    <p>Esporte fino <br /> Vista-se para a ocasião, mas priorize seu conforto</p>
                  </div>
                </div>
                <div className="info-item">
                  <MapPin className="icon" />
                  <div>
                    <strong>Local</strong>
                    <p className="location-name">Max Belém</p>
                    <p className="location-type">Salão de Festas (Condomínio)</p>
                    <p className="location-address" id="event-address">
                      R. Elói Cerqueira, 287 <br />
                      Belém, São Paulo - SP
                    </p>
                    <div className="map-actions">
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=R.+Elói+Cerqueira,+287+-+Belem,+São+Paulo+-+SP"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-btn google"
                      >
                        Google Maps
                      </a>
                      <a
                        href="https://waze.com/ul?ll=-23.541464,-46.591645&navigate=yes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-btn waze"
                      >
                        Waze
                      </a>
                      <button 
                        onClick={() => {
                          const address = "R. Elói Cerqueira, 287 - Belém, São Paulo - SP";
                          navigator.clipboard.writeText(address);
                          alert("Endereço copiado para a área de transferência!");
                        }}
                        className="map-btn copy"
                      >
                        Copiar Endereço
                      </button>
                    </div>
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
