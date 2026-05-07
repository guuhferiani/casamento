import React, { useState, useEffect } from 'react';
import { Users, Search, FileDown, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

// Componente de Gestão de Convidados - Última atualização: 02/05/2026
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

  // Group guests by initial letter
  const groupedGuests = filteredGuests.reduce((acc, guest) => {
    const initial = guest.nome_na_lista.charAt(0).toUpperCase();
    if (!acc[initial]) acc[initial] = [];
    acc[initial].push(guest);
    return acc;
  }, {});

  const sortedInitials = Object.keys(groupedGuests).sort();

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // --- PDF Identity Header ---
      doc.setFont("times", "bold");
      doc.setFontSize(26);
      doc.setTextColor(26, 26, 26);
      doc.text('Gustavo & Michele', 105, 20, { align: 'center' });
      
      doc.setFont("times", "italic");
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text('06 de Junho de 2026', 105, 28, { align: 'center' });
      
      // Decorative line
      doc.setDrawColor(55, 65, 81); // Dark Gray
      doc.setLineWidth(0.5);
      doc.line(40, 32, 170, 32);

      // Report Info
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(26, 26, 26);
      doc.text('Lista de Convidados Confirmados', 14, 45);
      
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      const date = new Date().toLocaleDateString('pt-BR');
      doc.text(`Relatório gerado em: ${date} | Total: ${guests.length} convidados`, 14, 52);
      
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
        startY: 60,
        theme: 'striped',
        headStyles: { fillColor: [55, 65, 81], textColor: [255, 255, 255] }, // Dark Gray
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
          <div className="stats-container flex flex-col items-center">
            <div className="stats-pill">
              <div className="pill-icon">
                <CheckCircle size={22} />
              </div>
              <div className="pill-content">
                <span className="pill-label">Total Confirmados</span>
                <p className="pill-number">{guests.length}</p>
              </div>
            </div>
          </div>

          <div className="actions-area flex flex-col md:flex-row justify-between items-center">
            <div className="search-bar relative flex-grow max-w-2xl w-full">
              <Search className="text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Buscar convidado..." 
                className="w-full bg-white border border-gray-200 rounded-xl focus:border-primary outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="btn flex items-center justify-center gap-3 px-8 py-4 shadow-md"
              onClick={exportToPDF}
              disabled={guests.length === 0}
            >
              <FileDown size={20} /> Exportar Lista (PDF)
            </button>
          </div>

          <div className="list-container bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            {loading ? (
              <div className="py-20 flex flex-col items-center">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-text-muted font-serif italic">Carregando lista...</p>
              </div>
            ) : filteredGuests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="management-table w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="text-sm uppercase font-bold text-white">
                        Nome na Lista
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.map((guest) => (
                      <tr key={guest.id} className="guest-row transition-colors">
                        <td>
                          <span className="font-medium text-text-main text-lg tracking-wide">{guest.nome_na_lista}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center">
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

        .stats-container {
          margin-bottom: 40px;
        }

        .stats-pill {
          background: white;
          padding: 12px 35px 12px 12px;
          border-radius: 100px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
        }

        .stats-pill:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(0,0,0,0.08);
        }

        .pill-icon {
          width: 54px;
          height: 54px;
          background: #f0ece6;
          color: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pill-content {
          display: flex;
          flex-direction: column;
        }

        .pill-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #9CA3AF;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 4px;
        }

        .pill-number {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #374151;
          line-height: 1;
        }

        .icon-wrapper {
          width: 60px;
          height: 60px;
          background: #f0ece6;
          color: var(--primary);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-bar svg {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .search-bar input {
          padding: 16px 16px 16px 48px;
        }

        .actions-area {
          margin-bottom: 30px;
          gap: 20px;
        }

        .alphabet-section {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .management-table thead tr {
          background-color: #374151;
        }

        .management-table thead th {
          padding: 24px 40px;
          letter-spacing: 3px;
          border: none;
        }

        .guest-row {
          cursor: default;
          border: none;
        }

        .guest-row td {
          padding: 25px 40px;
        }

        .guest-row:nth-child(even) {
          background-color: #f9fafb;
        }

        .guest-row:nth-child(odd) {
          background-color: #ffffff;
        }

        .guest-row:hover {
          background-color: #f3f4f6;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .stats-card {
            max-width: none;
          }
          .actions-area {
            gap: 15px;
          }
        }
      `}} />
    </div>
  );
};

export default GuestManagement;
