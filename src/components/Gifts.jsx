import React, { useState } from 'react';
import { Gift, CreditCard, QrCode, X, CheckCircle2, ChevronLeft } from 'lucide-react';

const Gifts = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('options'); // 'options', 'pix', 'credit', 'success'
  const [selectedGift, setSelectedGift] = useState(null);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const virtualGifts = [
    { id: 1, name: 'Cota para o champagne da festa', price: 'R$ 150,00', icon: '🥂' },
    { id: 2, name: 'Ajuda no enxoval', price: 'R$ 300,00', icon: '🏠' },
    { id: 3, name: 'Gasolina para o carro da noiva', price: 'R$ 100,00', icon: '🚗' },
    { id: 4, name: 'Jantar romântico na Lua de Mel', price: 'R$ 250,00', icon: '🍷' },
    { id: 5, name: 'Cota miau (para os gatos)', price: 'R$ 50,00', icon: '🐈' },
    { id: 6, name: 'Mimo surpresa', price: 'Livre', icon: '🎁' },
  ];

  const handleGiftClick = (gift) => {
    setSelectedGift(gift);
    setModalStep('options');
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const resetModal = () => {
    setShowModal(false);
    setModalStep('options');
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
  };

  return (
    <section id="gifts" className="gifts">
      <div className="container">
        <div className="section-title">
          <p>Presentes</p>
          <h2>Lista de Mimos</h2>
        </div>

        <div className="gifts-grid">
          <div className="virtual-gifts">
            <h3>Mimos Virtuais</h3>
            <p className="subtitle">Contribua com brincadeiras e experiências para o casal</p>
            <div className="items-grid">
              {virtualGifts.map((gift) => (
                <div key={gift.id} className="gift-item" onClick={() => handleGiftClick(gift)}>
                  <div className="gift-icon">{gift.icon}</div>
                  <h4>{gift.name}</h4>
                  <p>{gift.price}</p>
                  <button className="btn-small">Presentear</button>
                </div>
              ))}
            </div>
          </div>

          <div className="store-lists">
            <h3>Listas em Lojas</h3>
            <p className="subtitle">Se preferir itens físicos, confira nossa lista oficial</p>
            <div className="store-cards">
              <a href="https://www.camicado.com.br/lista/convidado/gustavos2michele" target="_blank" rel="noopener noreferrer" className="store-card">
                <Gift className="icon" />
                <span>Lista na Camicado</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={resetModal}><X /></button>
            
            {modalStep !== 'options' && modalStep !== 'success' && (
              <button className="absolute left-6 top-6 text-muted hover:text-primary transition-colors" onClick={() => setModalStep('options')}>
                <ChevronLeft size={20} />
              </button>
            )}

            <div className="modal-header">
              {modalStep === 'options' && <Gift className="w-12 h-12 text-primary mx-auto mb-4" />}
              {modalStep === 'pix' && <QrCode className="w-12 h-12 text-primary mx-auto mb-4" />}
              {modalStep === 'credit' && <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />}
              {modalStep === 'success' && <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />}
              
              <h3>{modalStep === 'success' ? 'Muito Obrigado!' : 'Presentear Casal'}</h3>
              <p>Escolha: <strong>{selectedGift?.name}</strong></p>
            </div>

            <div className="modal-content mt-6">
              {modalStep === 'options' && (
                <div className="flex flex-col gap-4">
                  <button className="btn w-full flex items-center justify-center gap-3" onClick={() => setModalStep('pix')}>
                    <QrCode size={20} /> Pagar com Pix
                  </button>
                  <button className="btn btn-outline w-full flex items-center justify-center gap-3" onClick={() => setModalStep('credit')}>
                    <CreditCard size={20} /> Cartão de Crédito
                  </button>
                </div>
              )}

              {modalStep === 'pix' && (
                <div className="animate-fade-in">
                  <div className="qr-placeholder">
                    <p className="text-sm mb-4">Escaneie o QR Code abaixo:</p>
                    <div className="bg-white p-4 inline-block rounded-lg mb-4">
                      <QrCode size={150} className="text-black" />
                    </div>
                    <code className="pix-key text-xs block bg-gray-100 p-2 rounded">sua-chave-pix-aqui@email.com</code>
                  </div>
                  <button className="btn w-full mt-6" onClick={() => setModalStep('success')}>Já realizei o Pix</button>
                </div>
              )}

              {modalStep === 'credit' && (
                <div className="animate-fade-in">
                  <div className="credit-card-container">
                    <div className="virtual-card">
                      <div className="card-chip"></div>
                      <div className="card-number">
                        {cardData.number || '•••• •••• •••• ••••'}
                      </div>
                      <div className="card-info">
                        <div>
                          <span className="info-label">Titular</span>
                          <span className="info-value">{cardData.name || 'NOME NO CARTÃO'}</span>
                        </div>
                        <div>
                          <span className="info-label">Validade</span>
                          <span className="info-value">{cardData.expiry || 'MM/AA'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form className="card-form-grid" onSubmit={(e) => { e.preventDefault(); setModalStep('success'); }}>
                    <div className="form-group">
                      <label className="text-xs uppercase tracking-wider mb-1">Número do Cartão</label>
                      <input 
                        type="text" 
                        name="number"
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        value={cardData.number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-xs uppercase tracking-wider mb-1">Nome do Titular</label>
                      <input 
                        type="text" 
                        name="name"
                        placeholder="Como no cartão"
                        value={cardData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-xs uppercase tracking-wider mb-1">Validade</label>
                      <input 
                        type="text" 
                        name="expiry"
                        placeholder="MM/AA"
                        maxLength="5"
                        value={cardData.expiry}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-xs uppercase tracking-wider mb-1">CVV</label>
                      <input 
                        type="text" 
                        name="cvv"
                        placeholder="000"
                        maxLength="3"
                        value={cardData.cvv}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <button type="submit" className="btn w-full mt-4" style={{ gridColumn: 'span 2' }}>
                      Confirmar Presente
                    </button>
                  </form>
                </div>
              )}

              {modalStep === 'success' && (
                <div className="text-center animate-fade-in">
                  <p className="text-lg font-medium mb-4">Seu carinho torna nossa história ainda mais especial!</p>
                  <p className="text-muted mb-8">Recebemos sua confirmação de presente. Mal podemos esperar para te ver no grande dia!</p>
                  <button className="btn w-full" onClick={resetModal}>Fechar</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gifts;
