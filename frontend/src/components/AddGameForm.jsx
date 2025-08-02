// gamelib/frontend/src/components/AddGameForm.jsx
import React, { useState, useEffect } from 'react';
import './AddGameForm.css'; // Vamos criar este CSS em breve

function AddGameForm({ consoles, onGameAdded, onShowMessage }) {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Estados para busca RAWG.io
  const [rawgSearchQuery, setRawgSearchQuery] = useState('');
  const [rawgSearchResults, setRawgSearchResults] = useState([]);
  const [isLoadingRawg, setIsLoadingRawg] = useState(false);

  // Estados para adição manual
  const [manualGameData, setManualGameData] = useState({
    title: '',
    consoleId: '',
    status: 'Backlog',
    releaseDate: '',
    coverImage: '',
    personalRating: '',
    metacriticScore: '',
  });

  const [activeForm, setActiveForm] = useState('rawg'); // 'rawg' ou 'manual'

  // Limpa o formulário manual quando a aba é trocada
  useEffect(() => {
    setManualGameData({
      title: '',
      consoleId: '',
      status: 'Backlog',
      releaseDate: '',
      coverImage: '',
      personalRating: '',
      metacriticScore: '',
    });
  }, [activeForm]);

  // Função de busca no RAWG.io
  const handleRawgSearch = async (e) => {
    e.preventDefault();
    if (!rawgSearchQuery.trim()) {
      onShowMessage('Por favor, digite um nome de jogo para pesquisar.', 'error');
      return;
    }
    // Verifica se uma console foi selecionada antes de pesquisar
    if (!manualGameData.consoleId) {
        onShowMessage('Selecione uma console para filtrar a pesquisa RAWG.io.', 'error');
        return;
    }

    setIsLoadingRawg(true);
    setRawgSearchResults([]);
    try {
      // Adiciona o consoleId à URL da requisição
      const response = await fetch(
        `${apiUrl}/api/games/search-rawg?query=${encodeURIComponent(rawgSearchQuery)}&consoleId=${manualGameData.consoleId}`
      );
      if (!response.ok) throw new Error('Falha ao buscar no RAWG.io.');
      const data = await response.json();
      setRawgSearchResults(data.results);
      if (data.results.length === 0) {
        onShowMessage('Nenhum jogo encontrado no RAWG.io com este termo para a console selecionada.', 'info');
      }
    } catch (error) {
      console.error('Erro na busca RAWG.io:', error);
      onShowMessage(`Erro na busca RAWG.io: ${error.message}`, 'error');
    } finally {
      setIsLoadingRawg(false);
    }
  };

  // Função para adicionar jogo do RAWG.io ao seu catálogo
  const handleAddRawgGame = async (rawgGame) => {
    // É essencial que o usuário selecione uma console
    if (!manualGameData.consoleId) {
      onShowMessage('Por favor, selecione uma console para este jogo.', 'error');
      return;
    }

    const gameData = {
      title: rawgGame.name,
      consoleId: manualGameData.consoleId, // Usar a console selecionada no formulário manual
      status: 'I Wanna Play It!', // Sugestão inicial de status
      rawgId: rawgGame.id,
      coverImage: rawgGame.background_image,
      releaseDate: rawgGame.released ? new Date(rawgGame.released) : null,
      metacriticScore: rawgGame.metacritic,
      // Você pode adicionar mais detalhes do rawgGame. Se for salvar tudo, pode ser:
      rawgDetails: rawgGame,
    };

    onGameAdded(gameData); // Chama a função passada pelo GameManager
    setRawgSearchQuery('');
    setRawgSearchResults([]);
  };

  // Função para adicionar jogo manualmente
  const handleManualSubmit = async (e) => {
    e.preventDefault();

    if (!manualGameData.title.trim() || !manualGameData.consoleId) {
      onShowMessage('Título do jogo e Console são obrigatórios!', 'error');
      return;
    }

    // Formata a data se existir
    const formattedData = { ...manualGameData };
    if (formattedData.releaseDate) {
      formattedData.releaseDate = new Date(formattedData.releaseDate);
    } else {
      delete formattedData.releaseDate; // Remove se vazio
    }
    // Converte rating e metacritic para números
    if (formattedData.personalRating) formattedData.personalRating = Number(formattedData.personalRating);
    if (formattedData.metacriticScore) formattedData.metacriticScore = Number(formattedData.metacriticScore);


    onGameAdded(formattedData); // Chama a função passada pelo GameManager
    setManualGameData({ // Reseta o formulário
      title: '',
      consoleId: '',
      status: 'Backlog',
      releaseDate: '',
      coverImage: '',
      personalRating: '',
      metacriticScore: '',
    });
  };

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualGameData(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div className="add-game-form-container">
      <div className="form-type-selector">
        <button
          className={activeForm === 'rawg' ? 'active' : ''}
          onClick={() => setActiveForm('rawg')}
        >
          Adicionar via RAWG.io
        </button>
        <button
          className={activeForm === 'manual' ? 'active' : ''}
          onClick={() => setActiveForm('manual')}
        >
          Adicionar Manualmente
        </button>
      </div>

      {consoles.length === 0 ? (
        <p className="warning-message">
          ⚠️ Por favor, adicione consoles primeiro na seção "Gerenciamento de Consoles" para poder adicionar jogos.
        </p>
      ) : (
        <>
          {/* Campo de seleção de Console Comum a ambos os modos */}
          <div className="form-group">
            <label htmlFor="selectConsole">Selecionar Console:</label>
            <select
              id="selectConsole"
              name="consoleId"
              value={manualGameData.consoleId}
              onChange={handleManualChange}
              required
            >
              <option value="">-- Selecione uma Console --</option>
              {consoles.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {/* Mensagem para o usuário selecionar uma console */}
            {!manualGameData.consoleId && <p className="selection-hint">Selecione uma console para filtrar as buscas RAWG.io.</p>}
          </div>

          {activeForm === 'rawg' && (
            <div className="rawg-search-section">
              <form onSubmit={handleRawgSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Pesquisar jogo no RAWG.io (ex: The Witcher 3)"
                  value={rawgSearchQuery}
                  onChange={(e) => setRawgSearchQuery(e.target.value)}
                  disabled={isLoadingRawg || !manualGameData.consoleId} // Desabilita se não há console selecionada
                />
                <button type="submit" disabled={isLoadingRawg || !manualGameData.consoleId}>
                  {isLoadingRawg ? 'Buscando...' : 'Pesquisar'}
                </button>
              </form>

              {rawgSearchResults.length > 0 && (
                <div className="rawg-results">
                  <h4>Resultados da Busca:</h4>
                  <div className="results-grid">
                    {rawgSearchResults.map(game => (
                      <div key={game.id} className="rawg-game-card">
                        <img src={game.background_image || 'https://via.placeholder.com/100x150?text=Sem+Capa'} alt={game.name} />
                        <div className="card-info">
                          <h5>{game.name}</h5>
                          <p>Lançamento: {game.released || 'N/A'}</p>
                          {game.metacritic && <p>Metacritic: {game.metacritic}</p>}
                          <button
                            onClick={() => handleAddRawgGame(game)}
                            disabled={!manualGameData.consoleId} // Desabilita se console não selecionada
                            title={!manualGameData.consoleId ? 'Selecione uma console acima para adicionar' : 'Adicionar este jogo ao seu catálogo'}
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeForm === 'manual' && (
            <form onSubmit={handleManualSubmit} className="manual-form">
              <div className="form-group">
                <label htmlFor="title">Título do Jogo:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={manualGameData.title}
                  onChange={handleManualChange}
                  placeholder="Nome do jogo"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  name="status"
                  value={manualGameData.status}
                  onChange={handleManualChange}
                >
                  <option value="Backlog">Backlog</option>
                  <option value="Played">Played</option>
                  <option value="I Wanna Play It!">I Wanna Play It!</option>
                  <option value="Wishlist">Wishlist</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="releaseDate">Data de Lançamento:</label>
                <input
                  type="date"
                  id="releaseDate"
                  name="releaseDate"
                  value={manualGameData.releaseDate}
                  onChange={handleManualChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="coverImage">URL da Imagem da Capa:</label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={manualGameData.coverImage}
                  onChange={handleManualChange}
                  placeholder="https://exemplo.com/capa.jpg"
                />
              </div>

              <div className="form-group">
                <label htmlFor="personalRating">Avaliação Pessoal (0-5):</label>
                <input
                  type="number"
                  id="personalRating"
                  name="personalRating"
                  value={manualGameData.personalRating}
                  onChange={handleManualChange}
                  min="0"
                  max="5"
                  step="0.5"
                  placeholder="Ex: 4.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="metacriticScore">Pontuação Metacritic:</label>
                <input
                  type="number"
                  id="metacriticScore"
                  name="metacriticScore"
                  value={manualGameData.metacriticScore}
                  onChange={handleManualChange}
                  min="0"
                  max="100"
                  placeholder="Ex: 92"
                />
              </div>

              <button type="submit">Adicionar Jogo Manualmente</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default AddGameForm;
