import React from 'react';
import useApi from '../hooks/useApi';

const Games = () => {
  const { data: games, loading: gamesLoading, error: gamesError } = useApi('games');
  const { data: consoles, loading: consolesLoading, error: consolesError } = useApi('consoles');

  if (gamesLoading || consolesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl">Carregando dados...</p>
      </div>
    );
  }

  if (gamesError || consolesError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p className="text-xl">Erro ao carregar os dados. Verifique a conexão com o backend.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Gerenciamento de Jogos</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Consoles Disponíveis</h2>
        <ul className="flex gap-4">
          {consoles.length > 0 ? (
            consoles.map(consoleItem => (
              <li key={consoleItem._id} className="bg-gray-700 p-4 rounded-lg shadow">
                {consoleItem.name}
              </li>
            ))
          ) : (
            <p className="text-gray-400">Nenhum console encontrado.</p>
          )}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Jogos Adicionados</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.length > 0 ? (
            games.map(game => (
              <li key={game._id} className="bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold">{game.title}</h3>
                <p className="text-gray-400 mt-1">{game.genre}</p>
                {/* Outras informações do jogo serão adicionadas aqui */}
              </li>
            ))
          ) : (
            <p className="text-gray-400">Nenhum jogo encontrado.</p>
          )}
        </ul>
      </section>
    </div>
  );
};

export default Games;
