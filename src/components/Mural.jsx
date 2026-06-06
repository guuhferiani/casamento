import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Send, ArrowLeft, Loader2, Heart, Plus, X, ZoomIn } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Mural = () => {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [legenda, setLegenda] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    fetchFotos();
    window.scrollTo(0, 0);

    // Subscrever a atualizações em tempo real no banco
    const subscription = supabase
      .channel('public:fotos_casamento')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'fotos_casamento' 
        }, 
        (payload) => {
          // Adicionar a foto no início da lista
          setFotos((prevFotos) => [payload.new, ...prevFotos]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchFotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fotos_casamento')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFotos(data || []);
    } catch (error) {
      console.error('Erro ao buscar fotos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar se o arquivo é uma imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Função de compressão da imagem usando Canvas API
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          // Manter proporção redimensionando para dimensões máximas
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Erro ao gerar blob da imagem.'));
              }
            },
            'image/jpeg',
            0.75 // Qualidade JPEG (75% é excelente custo-benefício)
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !selectedFile) {
      alert('Por favor, digite seu nome e escolha uma foto.');
      return;
    }

    setSubmitting(true);
    try {
      // Passo 1: Comprimir a imagem
      setProgressStatus('Otimizando imagem...');
      const compressedFile = await compressImage(selectedFile);

      // Passo 2: Upload para o Supabase Storage
      setProgressStatus('Enviando foto...');
      const fileExt = 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('fotos-casamento')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) throw storageError;

      // Passo 3: Pegar a URL pública da foto
      const { data: { publicUrl } } = supabase.storage
        .from('fotos-casamento')
        .getPublicUrl(fileName);

      // Passo 4: Inserir registro na tabela
      setProgressStatus('Registrando no mural...');
      const { error: dbError } = await supabase
        .from('fotos_casamento')
        .insert([
          {
            nome_convidado: nome,
            legenda: legenda,
            foto_url: publicUrl
          }
        ]);

      if (dbError) throw dbError;

      // Resetar form e fechar modal
      setNome('');
      setLegenda('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowModal(false);
      
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar a foto: ' + error.message);
    } finally {
      setSubmitting(false);
      setProgressStatus('');
    }
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setLegenda('');
  };

  return (
    <div className="mural-page min-h-screen pt-24 pb-40">
      {/* Background blobs decorativos */}
      <div className="organic-bg blob-1" style={{ opacity: 0.08, top: '5%', left: '-5%' }}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#000" d="M44.3,-62.4C55.4,-52.1,61.1,-35.3,64.2,-18.8C67.3,-2.3,67.8,13.9,62.8,28.8C57.9,43.7,47.5,57.3,33.5,64.6C19.5,71.9,1.8,72.9,-15.8,68.7C-33.4,64.5,-50.8,55.1,-61.8,40.7C-72.7,26.3,-77.2,6.9,-74.6,-11.2C-71.9,-29.3,-62,-46.1,-47.5,-55.5C-33.1,-64.8,-14.1,-66.7,2.5,-70.2C19.2,-73.6,33.2,-72.7,44.3,-62.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container">
        <header className="flex flex-col items-center mb-16 animate-fade-in">
          <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 group self-start">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest font-medium">Voltar para o início</span>
          </Link>
          
          <div className="section-title">
            <p>Compartilhe o seu ponto de vista</p>
            <h1 className="logo-text text-6xl mt-4 mb-6">Mural do Casamento</h1>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-[1px] bg-primary"></div>
              <Camera className="mx-4 text-primary" size={24} />
              <div className="w-24 h-[1px] bg-primary"></div>
            </div>
            <p className="description max-w-2xl mx-auto text-center font-serif italic text-text-muted text-lg">
              Tirou alguma foto linda ou divertida durante a nossa cerimônia ou festa? 
              Envie do seu celular para fazer parte da nossa história!
            </p>
          </div>

          <button className="btn flex items-center gap-2" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Compartilhar Foto
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p className="text-text-muted font-serif italic">Carregando mural de fotos...</p>
          </div>
        ) : fotos.length > 0 ? (
          <div className="mural-grid">
            {fotos.map((foto, index) => (
              <div 
                key={foto.id} 
                className="mural-card animate-fade-in"
                style={{ animationDelay: `${Math.min(index * 0.05, 1)}s` }}
                onClick={() => setLightboxImage(foto)}
              >
                <div className="mural-image-wrapper">
                  <img 
                    src={foto.foto_url} 
                    alt={`Foto de ${foto.nome_convidado}`} 
                    loading="lazy"
                  />
                  <div className="mural-hover-overlay">
                    <ZoomIn size={28} className="text-white" />
                  </div>
                </div>
                
                <div className="mural-info">
                  {foto.legenda && <p className="mural-caption font-serif">{foto.legenda}</p>}
                  <div className="mural-meta">
                    <span className="mural-author">Por {foto.nome_convidado}</span>
                    <span className="mural-time">
                      {new Date(foto.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-lg border border-dashed border-gray-200 animate-fade-in max-w-lg mx-auto">
            <Camera size={60} className="text-primary-light mx-auto mb-4 opacity-50" />
            <p className="text-xl text-text-muted font-serif italic mb-2">O mural ainda está vazio!</p>
            <p className="text-sm text-text-muted uppercase tracking-wider mb-6">Seja o primeiro a compartilhar um momento do dia de hoje!</p>
            <button className="btn" onClick={() => setShowModal(true)}>Enviar a Primeira Foto</button>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom da Imagem */}
      {lightboxImage && (
        <div className="modal-overlay" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setLightboxImage(null)}>
              <X size={32} />
            </button>
            <img 
              src={lightboxImage.foto_url} 
              alt={`Foto de ${lightboxImage.nome_convidado}`} 
              className="lightbox-image animate-fade-in"
            />
            <div className="lightbox-footer">
              <span className="lightbox-author">Por: {lightboxImage.nome_convidado}</span>
              {lightboxImage.legenda && <p className="lightbox-caption">{lightboxImage.legenda}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Upload de Fotos */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="mural-modal modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal} disabled={submitting}>
              <X size={24} />
            </button>
            
            <div className="modal-header text-center">
              <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-serif mb-2">Compartilhe um Momento</h3>
              <p className="text-text-muted text-xs uppercase tracking-widest">Sua foto aparecerá instantaneamente no mural do telão e do site!</p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2">Seu Nome</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-primary outline-none transition-all rounded text-sm"
                  placeholder="Ex: Seu nome, Família Feriani"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2">Foto</label>
                {!previewUrl ? (
                  <div className="photo-picker-zone">
                    <input 
                      type="file" 
                      id="mural-file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      required
                      className="hidden"
                    />
                    <label htmlFor="mural-file" className="photo-picker-label cursor-pointer">
                      <Camera size={32} className="text-text-muted mb-2" />
                      <span className="text-sm font-medium text-text-muted uppercase tracking-wider">Tirar Foto ou Escolher Arquivo</span>
                      <span className="text-xs text-text-muted mt-1 opacity-75">Tire do celular na hora!</span>
                    </label>
                  </div>
                ) : (
                  <div className="photo-preview-container">
                    <img src={previewUrl} alt="Preview do upload" className="photo-preview-image" />
                    <button 
                      type="button" 
                      className="photo-remove-btn" 
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      disabled={submitting}
                    >
                      <X size={16} /> Remover Foto
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2">Legenda / Mensagem (Opcional)</label>
                <textarea 
                  className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-primary outline-none transition-all rounded text-sm min-h-[80px]"
                  placeholder="Ex: Viva os noivos! Que festa linda!"
                  value={legenda}
                  onChange={(e) => setLegenda(e.target.value)}
                  disabled={submitting}
                  maxLength={150}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn w-full flex items-center justify-center gap-2 py-4"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>{progressStatus}</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Publicar no Mural</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CSS Encapsulado para a página de Mural */}
      <style dangerouslySetInnerHTML={{ __html: `
        .mural-page {
          background-color: #FAFAFA;
        }

        .mural-grid {
          column-count: 3;
          column-gap: 25px;
          margin-top: 40px;
        }

        @media (max-width: 992px) {
          .mural-grid {
            column-count: 2;
          }
        }

        @media (max-width: 600px) {
          .mural-grid {
            column-count: 1;
          }
        }

        .mural-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 25px;
          break-inside: avoid;
          border: 1px solid #EAEAEA;
          transition: var(--transition);
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);
        }

        .mural-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
          border-color: var(--primary);
        }

        .mural-image-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          background-color: #f5f5f5;
        }

        .mural-image-wrapper img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.5s ease;
        }

        .mural-card:hover .mural-image-wrapper img {
          transform: scale(1.03);
        }

        .mural-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: var(--transition);
          backdrop-filter: blur(2px);
        }

        .mural-card:hover .mural-hover-overlay {
          opacity: 1;
        }

        .mural-info {
          padding: 20px;
          border-top: 1px solid #f5f5f5;
        }

        .mural-caption {
          font-size: 0.95rem;
          color: var(--text-main);
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .mural-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #FAFAFA;
          padding-top: 10px;
        }

        .mural-author {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--primary);
        }

        .mural-time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        /* Foto picker zone */
        .photo-picker-zone {
          border: 2px dashed #DDD;
          border-radius: 6px;
          padding: 30px 20px;
          text-align: center;
          background: #FAFAFA;
          transition: var(--transition);
        }

        .photo-picker-zone:hover {
          border-color: var(--primary);
          background: #FFF;
        }

        .photo-picker-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .photo-preview-container {
          position: relative;
          width: 100%;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #EEE;
        }

        .photo-preview-image {
          width: 100%;
          height: auto;
          max-height: 250px;
          object-fit: cover;
          display: block;
        }

        .photo-remove-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #DDD;
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #FF4D4D;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .photo-remove-btn:hover {
          background: #FF4D4D;
          color: white;
          border-color: #FF4D4D;
        }

        .mural-modal.modal {
          max-width: 500px;
          width: 100%;
          padding: 35px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }

        /* Lightbox modal */
        .lightbox-modal {
          position: relative;
          max-width: 90vw;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .lightbox-image {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 4px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }

        .lightbox-footer {
          margin-top: 15px;
          color: white;
          text-align: center;
          max-width: 600px;
        }

        .lightbox-author {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 600;
          color: var(--primary-light);
          display: block;
          margin-bottom: 5px;
        }

        .lightbox-caption {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          line-height: 1.4;
          font-style: italic;
        }
      `}} />
    </div>
  );
};

export default Mural;
