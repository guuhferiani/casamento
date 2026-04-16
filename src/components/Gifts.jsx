import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, QrCode, X, CheckCircle2, ArrowLeft, Search } from 'lucide-react';

const Gifts = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('pix'); // 'pix', 'success'
  const [selectedGift, setSelectedGift] = useState(null);
  const [filter, setFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyPix = () => {
    navigator.clipboard.writeText("11982965197");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal]);

  const categories = ['Todos', 'Lua de Mel', 'Vida de Casado', 'Pets', 'Poupança'];
  const giftsData = [    // Lua de Mel
    { id: 1, name: 'Cota de Lua de Mel', price: 478.71, category: 'Lua de Mel', image: '/images/gifts/honeymoon-fun.png' },
    { id: 3, name: 'Cotas de lua de mel!', price: 364.26, category: 'Lua de Mel', isCota: true, shares: 5, image: '/images/gifts/honeymoon-cat.png' },
    { id: 6, name: 'Jantar especial na praia', price: 554.25, category: 'Lua de Mel', image: '/images/gifts/dinner-beach.png' },
    { id: 7, name: 'Jantar romântico', price: 326.49, category: 'Lua de Mel', image: '/images/gifts/dinner-romantic.png' },
    { id: 8, name: 'Jantar temático italiano', price: 447.81, category: 'Lua de Mel', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop' },
    { id: 9, name: 'Jantar temático japonês', price: 402.03, category: 'Lua de Mel', image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=600&auto=format&fit=crop' },
    { id: 10, name: 'Mergulho subaquático', price: 554.25, category: 'Lua de Mel', image: '/images/gifts/diving.png' },
    { id: 11, name: 'Passeio de lancha', price: 462.69, category: 'Lua de Mel', image: '/images/gifts/boat.png' },
    { id: 12, name: 'Curtir uma noite de balada', price: 630.93, category: 'Lua de Mel', image: 'https://images.unsplash.com/photo-1513245533132-aa7fad46d3c0?q=80&w=600&auto=format&fit=crop' },
    { id: 13, name: 'Drink de boas vindas ao Hotel', price: 174.27, category: 'Lua de Mel', image: '/images/gifts/nightlife.png' },
    { id: 14, name: 'Drinks no bar do hotel', price: 174.27, category: 'Lua de Mel', image: '/images/gifts/nightlife.png' },
    { id: 15, name: 'Café da manhã no hotel pós noite de núpcias', price: 249.80, category: 'Lua de Mel', image: '/images/gifts/breakfast.png' },
    { id: 16, name: 'Café da manhã servido no quarto', price: 326.49, category: 'Lua de Mel', image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=600&auto=format&fit=crop' },
    { id: 17, name: 'Champagne com cesta de frutas para a noite de núpcias', price: 326.49, category: 'Lua de Mel', image: '/images/gifts/champagne.png' },
    { id: 18, name: 'Tarde de spa para os noivos relaxarem', price: 630.93, category: 'Lua de Mel', image: '/images/gifts/spa.png' },
    { id: 19, name: 'Dia de beleza para os noivos', price: 478.71, category: 'Lua de Mel', image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600&auto=format&fit=crop' },
    { id: 20, name: 'Massagem relaxante para o casal', price: 539.37, category: 'Lua de Mel', image: '/images/gifts/spa.png' },
    
    // Vida de Casado
    { id: 21, name: 'Comprinhas de "sobrevivência" para a chegada na casa nova', price: 935.37, category: 'Vida de Casado', image: '/images/gifts/shopping.png' },
    { id: 22, name: 'Conjunto de controles remotos, para não ter briga', price: 112.46, category: 'Vida de Casado', image: '/images/gifts/remotes.png' },
    { id: 23, name: 'Apreciar um bom churrasco', price: 295.59, category: 'Vida de Casado', image: '/images/gifts/bbq.png' },
    { id: 24, name: 'Remedinho para ressaca do noivo', price: 97.58, category: 'Vida de Casado', image: '/images/gifts/hangover.png' },
    { id: 25, name: 'Balança para os noivos não engordarem após o casamento', price: 112.46, category: 'Vida de Casado', image: '/images/gifts/scale.png' },
    { id: 26, name: 'Um bom vinho para um final de tarde', price: 220.05, category: 'Vida de Casado', image: '/images/gifts/wine.png' },
    { id: 27, name: 'Ajuda com o excesso de bagagem', price: 174.27, category: 'Vida de Casado', image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=600&auto=format&fit=crop' },
    { id: 28, name: 'Ida às compras no centro da cidade', price: 783.15, category: 'Vida de Casado', image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=600&auto=format&fit=crop' },
    { id: 29, name: 'Comprar lembrancinhas para a família e amigos', price: 326.49, category: 'Vida de Casado', image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=600&auto=format&fit=crop' },
    
    // Pets
    { id: 30, name: 'Arranhador para gatos', price: 128.49, category: 'Pets', image: '/images/gifts/cat-accessories.png' },
    { id: 31, name: 'Divã para gatos', price: 143.36, category: 'Pets', image: '/images/gifts/cat-accessories.png' },
    { id: 32, name: 'Rede para gatos', price: 143.36, category: 'Pets', isCota: true, shares: 5, image: '/images/gifts/cat-accessories.png' },
    
    // Poupança / Brincadeiras
    { id: 33, name: 'Ajude a dar uma MEGA engordada no nosso porquinho', price: 593.16, category: 'Poupança', image: '/images/gifts/piggy-bank.png' },
    { id: 34, name: 'Ajude a engordar nosso porquinho', price: 295.59, category: 'Poupança', isCota: true, shares: 5, image: '/images/gifts/piggy-bank.png' },
    { id: 35, name: 'Cofrinho dos noivos', price: 593.16, category: 'Poupança', image: 'https://images.unsplash.com/photo-1535930749574-139a327ce803?q=80&w=600&auto=format&fit=crop' },
    { id: 36, name: 'Cofre novo para guardar as economias', price: 143.36, category: 'Poupança', isCota: true, shares: 5, image: '/images/gifts/piggy-bank.png' },
    { id: 37, name: 'Vale Presente', price: 593.16, category: 'Poupança', image: '/images/gifts/voucher-fun.png' },
    { id: 39, name: 'Vale-presente Especial', price: 215.47, category: 'Poupança', isCota: true, shares: 5, image: '/images/gifts/voucher-meme.png' },
    { id: 40, name: 'Vale-presente Solidário', price: 204.02, category: 'Poupança', isCota: true, shares: 5, image: '/images/gifts/help-groom.png' },
    { id: 41, name: 'Vale-presente Familiar', price: 181.13, category: 'Poupança', isCota: true, shares: 5, image: '/images/gifts/voucher-fun.png' },
    { id: 42, name: 'Vale-presente Amigo', price: 192.58, category: 'Poupança', image: '/images/gifts/voucher-meme.png' },
    { id: 44, name: 'Cota para nosso Chá de Porquinho Virtual', price: 364.26, category: 'Poupança', image: '/images/gifts/piggy-bank.png' },
  ];

  const filteredGifts = giftsData.filter(gift => {
    const matchesFilter = filter === 'Todos' || gift.category === filter;
    const matchesSearch = gift.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleGiftClick = (gift) => {
    setSelectedGift(gift);
    setModalStep('pix');
    setShowModal(true);
  };

  const resetModal = () => {
    setShowModal(false);
    setModalStep('pix');
    setCopied(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <>
      <section className="gifts-page animate-fade-in">
        <div className="container">
          <div className="gifts-header">
            <Link to="/" className="back-link">
              <ArrowLeft size={20} /> Voltar para o Início
            </Link>
            <div className="section-title">
              <p>Lista de Mimos</p>
              <h2 className="logo-text">Presentes para o Casal</h2>
              <p className="description">Escolha um presente simbólico para nos ajudar a começar nossa nova fase com muita alegria!</p>
            </div>
          </div>

          <div className="gifts-controls">
            <div className="filter-tabs">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar presente..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mimos-grid">
            {filteredGifts.length > 0 ? (
              filteredGifts.map((gift) => (
                <div key={gift.id} className="mimo-card" onClick={() => handleGiftClick(gift)}>
                  <div className="mimo-image">
                    <img src={gift.image} alt={gift.name} onError={(e) => { e.target.src = 'https://placehold.co/400x400/f8f8f8/1a1a1a?text=' + encodeURIComponent(gift.name); }} />
                  </div>
                  <div className="mimo-content">
                    <h4 className="mimo-name">{gift.name}</h4>
                    <p className="mimo-price">
                      {gift.isCota ? `${gift.shares} itens de ` : ''}
                      {formatPrice(gift.price)}
                    </p>
                    <button className="mimo-btn">COMPRAR</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>Nenhum presente encontrado com esse nome ou categoria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={resetModal}><X /></button>
            
            <div className="modal-header">
              {modalStep === 'pix' && <QrCode className="w-12 h-12 text-primary mx-auto mb-4" />}
              {modalStep === 'success' && <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />}
              
              <h3>{modalStep === 'success' ? 'Muito Obrigado!' : 'Presentear Casal'}</h3>
              <p>Você escolheu: <strong>{selectedGift?.name}</strong></p>
              <p className="price-tag">{formatPrice(selectedGift?.price)}</p>
            </div>

            <div className="modal-content mt-6">
              {modalStep === 'pix' && (
                <div className="animate-fade-in text-center">
                  <div className="qr-placeholder">
                    <p className="text-sm mb-4">Escaneie o QR Code ou use a chave abaixo:</p>
                    <div className="bg-white p-4 inline-block rounded-lg mb-4 shadow-sm border overflow-hidden">
                      <img src="/images/pix-qr.png" alt="Pix QR Code" className="w-[180px] h-[180px] object-contain mx-auto" />
                    </div>
                    <div className="pix-copy-container">
                      <code className="pix-key">11982965197</code>
                      <button 
                        className={`btn-copy ${copied ? 'copied' : ''}`}
                        onClick={handleCopyPix}
                        title="Copiar Chave Pix"
                      >
                        {copied ? 'Copiado!' : 'Copiar Chave'}
                      </button>
                    </div>
                  </div>
                  <button className="btn w-full mt-6" onClick={() => setModalStep('success')}>Já realizei o Pix</button>
                </div>
              )}

              {modalStep === 'success' && (
                <div className="text-center animate-fade-in">
                  <div className="success-icon-wrapper">
                    <CheckCircle2 size={60} className="text-green-500 mx-auto" />
                  </div>
                  <p className="text-lg font-medium mb-4">Seu carinho torna nossa história ainda mais especial!</p>
                  <p className="text-muted mb-8">Obrigado por nos presentear. Sua contribuição foi registrada com sucesso.</p>
                  <button className="btn w-full" onClick={resetModal}>Fechar</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gifts;
