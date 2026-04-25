import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Send, ArrowLeft, Loader2, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Story from './Story'; // Importing to reuse the modal if needed, but better to implement here for isolation

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchMessages();
    window.scrollTo(0, 0);

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('mensagens_noivos_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'mensagens_noivos' 
        }, 
        (payload) => {
          // Add the new message to the top of the list
          setMessages((prevMessages) => [payload.new, ...prevMessages]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mensagens_noivos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !mensagem) return;

    setSubmitting(true);
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
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitted(false);
  };

  return (
    <div className="messages-page min-h-screen pt-24 pb-40">
      {/* Background Organic Elements */}
      <div className="organic-bg blob-1" style={{ opacity: 0.1, top: '10%' }}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#000" d="M45.7,-57.1C58.9,-49.2,69.1,-35.1,72.4,-19.7C75.7,-4.3,72.1,12.5,64.4,27.5C56.7,42.5,44.9,55.7,30.6,62.8C16.3,69.9,-0.4,70.9,-16.9,67.1C-33.4,63.3,-49.6,54.7,-60.9,41C-72.2,27.3,-78.6,8.4,-76.3,-9.4C-74,-27.2,-63,-43.8,-48.6,-51.4C-34.1,-59,-16.2,-57.6,0.3,-58C16.8,-58.4,32.5,-65,45.7,-57.1Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container">
        <header className="flex flex-col items-center mb-16 animate-fade-in">
          <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 group self-start">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest font-medium">Voltar para o início</span>
          </Link>
          
          <div className="section-title">
            <p>Carinho dos nossos convidados</p>
            <h1 className="logo-text text-6xl mt-4 mb-6">Mensagens de Carinho</h1>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-[1px] bg-primary"></div>
              <Heart className="mx-4 text-primary" size={24} />
              <div className="w-24 h-[1px] bg-primary"></div>
            </div>
          </div>

          <button className="btn" onClick={() => setShowModal(true)}>
            Deixar Mensagem
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p className="text-text-muted font-serif italic">Carregando mensagens...</p>
          </div>
        ) : messages.length > 0 ? (
          <div className="messages-grid">
            {messages.map((msg, index) => (
              <div 
                key={msg.id} 
                className="message-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Quote className="quote-icon" size={30} />
                <p className="message-text">{msg.mensagem}</p>
                <div className="message-footer">
                  <span className="sender-name">{msg.nome}</span>
                  <span className="message-date">
                    {new Date(msg.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <MessageSquare size={60} className="text-primary-light mx-auto mb-4" />
            <p className="text-xl text-text-muted font-serif italic">Nenhuma mensagem ainda. Seja o primeiro a escrever!</p>
          </div>
        )}
      </div>

      {/* Styles for this page specifically */}
      <style dangerouslySetInnerHTML={{ __html: `
        .messages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
          margin-top: 40px;
          margin-bottom: 60px;
        }

        .message-card {
          background: white;
          padding: 40px;
          border-radius: 4px;
          border: 1px solid #eee;
          position: relative;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
        }

        .message-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
          border-color: var(--primary);
        }

        .quote-icon {
          color: var(--primary-light);
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .message-text {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-main);
          margin-bottom: 30px;
          flex-grow: 1;
        }

        .message-footer {
          display: flex;
          flex-direction: column;
          gap: 5px;
          border-top: 1px solid #f5f5f5;
          padding-top: 20px;
        }

        .sender-name {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.85rem;
          color: var(--primary);
        }

        .message-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .messages-grid {
            grid-template-columns: 1fr;
          }
          
          .message-card {
            padding: 30px;
          }

          .logo-text.text-6xl {
            font-size: 3rem;
          }
        }

        .messages-page .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .messages-page .modal {
          background: white;
          width: 100%;
          max-width: 500px;
          padding: 40px;
          border-radius: 4px;
          position: relative;
        }

        .messages-page .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
        }
      `}} />

      {/* Message Modal (Reusing structure from Story.jsx) */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            
            {!submitted ? (
              <>
                <div className="modal-header text-center">
                  <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-serif mb-2">Deixe sua Mensagem</h3>
                  <p className="text-text-muted text-sm uppercase tracking-widest">Escreva palavras de carinho para o nosso novo capítulo juntos.</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2">Seu Nome</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-primary outline-none transition-all rounded"
                      placeholder="Ex: João e Maria"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2">Mensagem</label>
                    <textarea 
                      className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-primary outline-none transition-all rounded min-h-[120px]"
                      placeholder="Deseje algo especial..."
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn w-full flex items-center justify-center gap-2 py-4"
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Enviar Mensagem</>}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <Heart size={60} className="text-primary mx-auto mb-4 fill-primary" />
                <h3 className="text-2xl font-serif mb-2">Mensagem Enviada!</h3>
                <p className="text-muted mb-8">Obrigado pelo carinho. Sua mensagem foi guardada em nossos corações.</p>
                <button className="btn w-full" onClick={closeModal}>Fechar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
