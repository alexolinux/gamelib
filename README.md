# 🎮 Gamelib

A smooth, modern web application for managing your video game collection. Built with Node.js, React, and Tailwind CSS.

## ✨ Features

- **Multi-Device Support**: Fully responsive design for Smartphones, Tablets, and Desktops.
- **Collection Management**: Easily organize your consoles and games.
- **IGDB Integration**: Search and add games directly from the IGDB database.
- **Filter & Sort**: Organize your library by status, metacritic score, and release date.
- **Wishlist**: Keep track of the games you want to play next.

## 🚀 Requirements

- `docker` and `docker-compose`
- An [IGDB](https://api-docs.igdb.com/) Client ID and Client Secret (created in the Twitch Developer Console).

## 🏗️ Structure

The application consists of containerized microservices:

- **Database**: MongoDB (Latest)
- **Backend**: Node.js v20 (Express)
- **Frontend**: React (Vite + Tailwind CSS)

## 🛠️ How to Run

1. **Clone the repository**:
   
   ```shell
   git clone https://github.com/alexolinux/gamelib.git
   cd gamelib
   ```

2. **Configure Environment**:
   
   Create a `.env` file based on `env.template`:
   
   ```shell
   cp env.template .env
   # Edit .env with IGDB_CLIENT_ID and IGDB_CLIENT_SECRET
   ```

4. **Start the Application**:
   
   ```shell
   docker-compose up -d --build
   ```

   ```shell
   # Output
   ✔ frontend                      Built
   ✔ backend                       Built
   ✔ Network gamelib_network       Created
   ✔ mongodb_container             Started
   ✔ backend_container             Started
   ✔ frontend_container            Started
   ```

5. **Access**:
   Open browser at [http://localhost:5173](http://localhost:5173).

## 🔁 Migração RAWG → IGDB

Os IDs do RAWG não são compatíveis com os IDs do IGDB. O migrador liga os documentos atuais ao IGDB pelo nome exato da plataforma e do jogo, mantendo `rawgId` como histórico e sem substituir metadados, estado ou lista de desejos.

Antes de alterar a base, faça um backup e execute uma simulação:

```shell
./scripts/db-manager.sh backup
docker compose exec backend node scripts/migrate-rawg-to-igdb.js
```

Revise no relatório as secções `unmatched` e `ambiguous`. Corrija manualmente esses itens no MongoDB (ou cadastre a plataforma correta pela aplicação) e só então aplique os vínculos encontrados:

```shell
docker compose exec backend node scripts/migrate-rawg-to-igdb.js --apply
```

Depois da migração, consoles sem `igdbId` continuam funcionais para cadastro manual, mas não podem ser usados na busca do IGDB até receberem o ID correspondente.

## 💾 Database Management

A portable script for database operations located in `scripts/db-manager.sh`.

### Commands:

- **Backup**: Create a timestamped dump of your database.
  
  ```shell
  ./scripts/db-manager.sh backup
  ```
  
- **Restore**: Restore data from a specific backup folder.
  
  ```shell
  ./scripts/db-manager.sh restore 2026-02-22-14-00
  ```
  
- **Import**: Import external JSON data (e.g., your prelude file).
  
  ```shell
  ./scripts/db-manager.sh import path/to/prelude.json
  ```

## 🤝 Credits

All thanks to my great friend and brother **[Tiago-S-Ribeiro](https://github.com/Tiago-S-Ribeiro)**, the holder of the original idea.

## 👤 Author

**Alex Mendes** - [alexolinux](https://github.com/alexolinux/)
- [LinkedIn](https://www.linkedin.com/in/mendesalex)

---
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)
