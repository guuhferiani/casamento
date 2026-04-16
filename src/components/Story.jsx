import React, { useState } from 'react';
import { Heart, X, MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Story = () => {
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !mensagem) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('mensagens_noivos')
        .insert([{ nome, mensagem }]);

      if (error) throw error;
      
      setSubmitted(true);
      setNome('');
      setMensagem('');
    } catch (error) {
      alert('Erro ao enviar mensagem: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitted(false);
  };

  return (
    <section id="story" className="story">
      {/* Background Organic Elements */}
      <div className="organic-bg blob-1">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#E0E0E0" d="M45.7,-57.1C58.9,-49.2,69.1,-35.1,72.4,-19.7C75.7,-4.3,72.1,12.5,64.4,27.5C56.7,42.5,44.9,55.7,30.6,62.8C16.3,69.9,-0.4,70.9,-16.9,67.1C-33.4,63.3,-49.6,54.7,-60.9,41C-72.2,27.3,-78.6,8.4,-76.3,-9.4C-74,-27.2,-63,-43.8,-48.6,-51.4C-34.1,-59,-16.2,-57.6,0.3,-58C16.8,-58.4,32.5,-65,45.7,-57.1Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div className="organic-bg blob-2">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#E0E0E0" d="M39.6,-56.3C52.1,-48.9,63.6,-38.7,69.7,-25.9C75.8,-13.1,76.5,2.4,72.1,16.4C67.7,30.4,58.2,42.9,46.1,52.2C34,61.5,19.3,67.5,3.4,62.8C-12.5,58.1,-29.6,42.7,-43.3,28.8C-57,14.9,-67.3,2.4,-67.9,-11.5C-68.5,-25.4,-59.4,-40.7,-46.5,-48.5C-33.6,-56.3,-16.8,-56.6,-1.1,-55.1C14.6,-53.6,27.1,-63.7,39.6,-56.3Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container">
        <div className="section-title">
          <p>Nossa História</p>
          <h2>O Começo de Tudo</h2>
        </div>

        {/* Part 1: Classic (Photo Left) */}
        <div className="story-part">
          <div className="story-content">
            <div className="story-image animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <img src="/images/G_M-187.webp" alt="O Início" />
            </div>
            <div className="story-text">
              <p>
                Nossa jornada começou de forma inesperada, mas desde o primeiro momento soubemos que havia algo especial. 
                Entre conversas intermináveis e sorrisos compartilhados, fomos construindo uma base sólida de amizade, 
                respeito e, acima de tudo, muito amor.
              </p>
              <p className="mt-4">
                Cada encontro era uma nova descoberta e cada risada fortalecia o laço que hoje nos une. 
                O que começou com uma simples coincidência se transformou na história mais linda de nossas vidas.
              </p>
            </div>
          </div>
        </div>

        {/* Part 2: Geometric (Photo Right - Reference Style) */}
        <div className="story-part">
          <div className="story-geometric">
            <div className="geo-text-container">
              <div className="vertical-text-container">
                <div className="vertical-line"></div>
                <div className="vertical-text">Vão se casar</div>
              </div>
              <h3 className="geo-names">
                <span>Gustavo</span>
                <span className="flex items-center gap-2">
                  <Heart className="heart-icon text-black" size={28} /> Michele
                </span>
              </h3>
              <p className="geo-description">
                Hoje, estamos prontos para dizer o "sim" mais importante das nossas vidas. 
                Construímos um lar fundamentado no amor e na parceria, e mal podemos esperar para 
                começar este novo capítulo cercados pelas pessoas que tornam nossa jornada ainda mais feliz.
              </p>
              <p className="geo-date">06 / 06 / 2026</p>
            </div>

            <div className="geo-image-container animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="geo-bg-block block-light"></div>
              <div className="geo-bg-block block-gray"></div>
              <img src="/images/G_M-57.webp" alt="Gustavo e Michele" className="geo-photo" />
            </div>
          </div>
        </div>

        <div className="message-btn-container mt-10 text-center relative z-10">
          <button className="btn btn-outline" onClick={() => setShowModal(true)}>
            Deixe uma mensagem para os noivos
          </button>
        </div>
      </div>

      {/* Message Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}><X /></button>
            
            {!submitted ? (
              <>
                <div className="modal-header">
                  <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3>Deixe sua Mensagem</h3>
                  <p>Escreva palavras de carinho para o nosso novo capítulo juntos.</p>
                </div>

                <form className="modal-content mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div className="form-group text-left">
                    <label className="block text-sm font-medium mb-1 uppercase tracking-widest text-xs">Seu Nome</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Ex: João e Maria"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group text-left">
                    <label className="block text-sm font-medium mb-1 uppercase tracking-widest text-xs">Mensagem</label>
                    <textarea 
                      className="form-input"
                      placeholder="Deseje algo especial..."
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn w-full flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Enviar Mensagem</>}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8 animate-fade-in">
                <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-serif mb-2">Mensagem Enviada!</h3>
                <p className="text-muted mb-8">Obrigado pelo carinho. Sua mensagem foi guardada em nossos corações.</p>
                <button className="btn w-full" onClick={closeModal}>Fechar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Story;
