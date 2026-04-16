import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Check, Loader2, Search } from 'lucide-react';

const RSVP = () => {
  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  const searchRef = useRef(null);

  useEffect(() => {
    fetchGuests();
    
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('convidados')
        .select('id, nome_na_lista')
        .eq('confirmado', false)
        .order('nome_na_lista', { ascending: true });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Erro ao buscar convidados:', error.message);
    } finally {
      setFetching(false);
    }
  };

  const filteredGuests = searchTerm.length >= 2 
    ? guests.filter(guest => 
        guest.nome_na_lista.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelect = (guest) => {
    setSelectedGuest(guest);
    setSearchTerm(guest.nome_na_lista);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGuest) {
      alert('Favor selecionar o seu nome na lista de sugestões.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('convidados')
        .update({ 
          confirmado: true
        })
        .eq('id', selectedGuest.id);

      if (error) throw error;
      
      setSubmitted(true);
      fetchGuests();
    } catch (error) {
      alert('Erro ao confirmar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="rsvp">
      <div className="container">
        <div className="rsvp-card">
          <div className="section-title">
            <h2>Confirme sua Presença</h2>
            <p className="mt-2 text-sm">Por favor, confirme até o dia 01/05/2026</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="rsvp-form">
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Busque seu nome na lista</label>
                <div className="search-container" ref={searchRef}>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Comece a digitar seu nome..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                        setSelectedGuest(null); // Reset selection if typing
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      autoComplete="off"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
                  </div>

                  {showSuggestions && searchTerm.length >= 2 && (
                    <div className="suggestions-list shadow-lg">
                      {filteredGuests.length > 0 ? (
                        filteredGuests.map((guest) => (
                          <div 
                            key={guest.id} 
                            className="suggestion-item"
                            onClick={() => handleSelect(guest)}
                          >
                            {guest.nome_na_lista}
                          </div>
                        ))
                      ) : (
                        <div className="no-results">Nenhum nome encontrado...</div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted mt-2 italic">Dica: Digite pelo menos 2 letras para buscar.</p>
              </div>

              <button type="submit" className="btn w-full" disabled={loading || !selectedGuest}>
                {loading ? <Loader2 className="animate-spin inline mr-2" /> : 'Confirmar Presença'}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">
                <Check className="w-12 h-12" />
              </div>
              <h3>Presença Confirmada!</h3>
              <p>Obrigado, <strong>{selectedGuest?.nome_na_lista}</strong>! Sua presença foi registrada com sucesso.</p>
              <button 
                className="btn btn-outline mt-6" 
                onClick={() => {
                  setSubmitted(false); 
                  setSelectedGuest(null);
                  setSearchTerm('');
                }}
              >
                Confirmar outro convidado
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RSVP;
