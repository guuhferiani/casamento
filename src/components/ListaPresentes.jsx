import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';

const ListaPresentes = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="camicado-page animate-fade-in">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} /> Voltar para o Início
          </Link>
          <h1 className="section-title">Lista de Presentes</h1>
        </div>

        <div className="camicado-card-container">
          {/* Camicado Card */}
          <div className="camicado-card">
            <div className="camicado-logo-section">
              <img src="/images/camicado-logo.png" alt="Camicado Logo" className="camicado-logo" />
            </div>
            
            <div className="camicado-info-section">
              <h2 className="logo-text">Camicado</h2>
              <p className="subtitle">Lista de Presentes Físicos</p>
              
              <div className="info-grid">
                <div className="info-item">
                  <Phone size={20} className="icon" />
                  <div>
                    <span className="label">Telefone</span>
                    <p className="value">(11) 98296-5197</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <MapPin size={20} className="icon" />
                  <div>
                    <span className="label">Endereço de Entrega</span>
                    <p className="value">Rua Cajuru, 89 Apto 64</p>
                  </div>
                </div>
              </div>

              <div className="action-area">
                <a 
                  href="https://www.camicado.com.br/lista/convidado/gustavos2michele" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary btn-large w-full flex items-center justify-center gap-3"
                >
                  Clique aqui para acessar o site <ExternalLink size={18} />
                </a>
                <p className="helper-text">Você será redirecionado para a página oficial da nossa lista na Camicado.</p>
              </div>
            </div>
          </div>

          {/* Casas Bahia Card */}
          <div className="camicado-card casas-bahia-card">
            <div className="camicado-logo-section casas-bahia-logo-section">
              <img src="/images/casas-bahia-logo.png" alt="Casas Bahia Logo" className="camicado-logo" />
            </div>
            
            <div className="camicado-info-section">
              <h2 className="logo-text" style={{ color: '#003399' }}>Casas Bahia</h2>
              <p className="subtitle">Lista de Presentes Físicos</p>
              
              <div className="info-grid">
                <div className="info-item">
                  <Phone size={20} className="icon" style={{ color: '#003399' }} />
                  <div>
                    <span className="label">Telefone</span>
                    <p className="value">(11) 98296-5197</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <MapPin size={20} className="icon" style={{ color: '#003399' }} />
                  <div>
                    <span className="label">Endereço de Entrega</span>
                    <p className="value">Rua Cajuru, 89 Apto 64</p>
                  </div>
                </div>
              </div>

              <div className="action-area">
                <a 
                  href="https://listas.casasbahia.com.br/micheleegustavo2026" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary btn-large w-full flex items-center justify-center gap-3"
                  style={{ background: '#003399', borderColor: '#003399' }}
                >
                  Clique aqui para acessar o site <ExternalLink size={18} />
                </a>
                <p className="helper-text">Você será redirecionado para a página oficial da nossa lista nas Casas Bahia.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListaPresentes;
