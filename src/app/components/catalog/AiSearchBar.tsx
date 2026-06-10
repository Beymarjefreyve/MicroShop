import { useState, KeyboardEvent } from 'react';
import { Product } from '../../services/catalogService';
import { recommendationService } from '../../services/recommendationService';
import authService from '../../services/authService';

interface AiSearchBarProps {
  onResults: (products: Product[], explanation: string, source: string) => void;
  onClear: () => void;
  isActive: boolean;
}

export function AiSearchBar({ onResults, onClear, isActive }: AiSearchBarProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const trimmed = prompt.trim();
    if (trimmed.length < 3) {
      setError('Escribe al menos 3 caracteres');
      return;
    }
    if (trimmed.length > 500) {
      setError('Máximo 500 caracteres');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = authService.getUser();
      const result = await recommendationService.aiSearch(
        user?.id ?? null,
        trimmed,
        12
      );
      onResults(result.products, result.explanation, result.source);
    } catch (e: any) {
      const msg = e.message || '';
      if (msg.toLowerCase().includes('muchas consultas') || msg.includes('429')) {
        setError('Demasiadas consultas seguidas. Espera unos segundos.');
      } else {
        setError('No se pudo conectar con el asistente IA. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setPrompt('');
    setError('');
    onClear();
  };

  return (
    <div className="w-full">
      {/* Barra de búsqueda IA */}
      <div className={`relative flex items-center gap-2 p-1 rounded-2xl border-2 transition-all shadow-sm ${
        isActive
          ? 'border-purple-500 bg-purple-50 shadow-purple-100'
          : 'border-[#E5E7EB] bg-white hover:border-purple-300'
      }`}>
        {/* Ícono IA */}
        <div className="flex-shrink-0 pl-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke={isActive ? '#7C3AED' : '#9CA3AF'} strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
          </svg>
        </div>

        <input
          type="text"
          value={prompt}
          onChange={e => { setPrompt(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder="✨ Describe lo que buscas... (ej: regalo tecnológico para niño de 8 años)"
          className="flex-1 py-2.5 bg-transparent text-[#111827] placeholder-[#9CA3AF] focus:outline-none text-sm"
          disabled={loading}
          maxLength={500}
        />

        {/* Botón limpiar (si hay texto o resultados activos) */}
        {(prompt || isActive) && !loading && (
          <button
            onClick={handleClear}
            className="flex-shrink-0 p-1.5 text-[#9CA3AF] hover:text-[#6B7280] transition-colors rounded-lg"
            title="Limpiar búsqueda IA"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}

        {/* Botón buscar */}
        <button
          onClick={handleSearch}
          disabled={loading || prompt.trim().length < 3}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"/>
              </svg>
              <span className="hidden sm:inline">Buscando...</span>
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span className="hidden sm:inline">Buscar con IA</span>
              <span className="sm:hidden">IA</span>
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-500 pl-2">{error}</p>
      )}

      {/* Sugerencias de ejemplo (solo cuando no hay búsqueda activa) */}
      {!isActive && !prompt && (
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            'Regalo tecnológico bajo $200.000',
            'Audífonos para gaming',
            'Ropa deportiva para correr',
          ].map(suggestion => (
            <button
              key={suggestion}
              onClick={() => { setPrompt(suggestion); setError(''); }}
              className="text-xs px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
