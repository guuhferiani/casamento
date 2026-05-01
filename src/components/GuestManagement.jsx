import React, { useState, useEffect } from 'react';
import { Users, Search, FileDown, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

const GuestManagement = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGuests();
    window.scrollTo(0, 0);

    // Subscribe to real-time updates for RSVP confirmations
    const subscription = supabase
      .channel('convidados_management_changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'convidados' 
        }, 
        (payload) => {
          // If a guest was confirmed, refresh the list
          if (payload.new.confirmado) {
            setGuests((prev) => {
              const exists = prev.find(g => g.id === payload.new.id);
              if (exists) {
                return prev.map(g => g.id === payload.new.id ? payload.new : g);
              } else {
                return [payload.new, ...prev].sort((a, b) => a.nome_na_lista.localeCompare(b.nome_na_lista));
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('convidados')
        .select('*')
        .eq('confirmado', true)
        .order('nome_na_lista', { ascending: true });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Erro ao buscar convidados:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(guest => 
    guest.nome_na_lista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(26, 26, 26);
      doc.text('Lista de Convidados Confirmados', 14, 22);
      
      // Add date and total
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      const date = new Date().toLocaleDateString('pt-BR');
      doc.text(`Gerado em: ${date} | Total de Confirmados: ${guests.length}`, 14, 30);
      
      // Define table columns and data
      const tableColumn = ["Nome na Lista"];
      const tableRows = [];

      guests.forEach(guest => {
        const guestData = [
          guest.nome_na_lista
        ];
        tableRows.push(guestData);
      });

      // Generate table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'striped',
        headStyles: { fillColor: [196, 172, 142], textColor: [255, 255, 255] }, // Match primary color
        styles: { fontSize: 10, cellPadding: 5 },
      });

      // Save the PDF
      doc.save(`lista_convidados_confirmados_${date.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    }
  };

  return (
    <div className="management-page min-h-screen pt-24 pb-40">
      {/* Background Organic Elements */}
      <div className="organic-bg blob-1" style={{ opacity: 0.05, top: '5%' }}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#000" d="M45.7,-57.1C58.9,-49.2,69.1,-35.1,72.4,-19.7C75.7,-4.3,72.1,12.5,64.4,27.5C56.7,42.5,44.9,55.7,30.6,62.8C16.3,69.9,-0.4,70.9,-16.9,67.1C-33.4,63.3,-49.6,54.7,-60.9,41C-72.2,27.3,-78.6,8.4,-76.3,-9.4C-74,-27.2,-63,-43.8,-48.6,-51.4C-34.1,-59,-16.2,-57.6,0.3,-58C16.8,-58.4,32.5,-65,45.7,-57.1Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container">
        <header className="flex flex-col items-center mb-12 animate-fade-in">
          <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 group self-start">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest font-medium">Voltar para o início</span>
          </Link>
          
          <div className="section-title text-center">
            <p className="uppercase tracking-widest text-primary font-medium mb-2">Painel Administrativo</p>
            <h1 className="logo-text text-5xl mb-6">Gestão de Convidados</h1>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-[1px] bg-primary"></div>
              <Users className="mx-4 text-primary" size={24} />
              <div className="w-24 h-[1px] bg-primary"></div>
            </div>
          </div>
        </header>

        <div className="management-content animate-fade-in">
          {/* Stats and Actions */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <div className="stats-card">
              <div className="flex items-center gap-4">
                <div className="icon-wrapper">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <span className="text-sm text-text-muted uppercase tracking-widest">Total Confirmados</span>
                  <p className="text-3xl font-serif font-bold">{guests.length}</p>
                </div>
              </div>
            </div>

            <div className="actions-area flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="search-bar relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar convidado..." 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="btn flex items-center justify-center gap-2"
                onClick={exportToPDF}
                disabled={guests.length === 0}
              >
                <FileDown size={18} /> Exportar PDF
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="table-container bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-text-muted font-serif italic">Carregando lista...</p>
              </div>
            ) : filteredGuests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-4 text-xs uppercase tracking-widest font-semibold text-text-muted">Convidado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredGuests.map((guest, index) => (
                      <tr 
                        key={guest.id} 
                        className="hover:bg-gray-50 transition-colors"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-8 py-5">
                          <span className="font-medium text-text-main">{guest.nome_na_lista}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20">
                <Users size={60} className="text-gray-100 mx-auto mb-4" />
                <p className="text-xl text-text-muted font-serif italic">
                  {searchTerm ? 'Nenhum convidado encontrado para esta busca.' : 'Nenhuma confirmação registrada até o momento.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .management-page {
          background-color: #fafafa;
        }

        .stats-card {
          background: white;
          padding: 25px 40px;
          border-radius: 12px;
          border: 1px solid #eee;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          width: 100%;
          max-width: 300px;
        }

        .icon-wrapper {
          width: 50px;
          height: 50px;
          background: #f0ece6;
          color: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .table-container {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .stats-card {
            max-width: none;
          }
        }
      `}} />
    </div>
  );
};

export default GuestManagement;
