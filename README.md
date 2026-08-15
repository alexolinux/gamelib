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

## 🔁 Migration from RAWG → to IGDB

RAWG IDs are not compatible with IGDB IDs. The migrator links current documents to IGDB using the exact platform and game name, keeping rawgId as historical data and not replacing metadata, status, or wishlist.

Before changing the database, create a backup and run a simulation:

```shell
./scripts/db-manager.sh backup
docker-compose exec backend node scripts/migrate-rawg-to-igdb.js
```

Review the unmatched and ambiguous sections in the report. Manually correct these items in MongoDB (or register the correct platform via the application) and then apply the found links:

```shell
docker-compose exec backend node scripts/migrate-rawg-to-igdb.js --apply
```

After migration, consoles without igdbId remain functional for manual registration, but cannot be used in IGDB search until they receive the corresponding ID.

If games were added between the first IGDB integration version and the ratings correction, run the simulation below. It only moves an external rating that is safely identifiable to `communityRating`; distinct personal ratings remain untouched.

```shell
docker-compose exec backend node scripts/repair-igdb-personal-ratings.js
docker-compose exec backend node scripts/repair-igdb-personal-ratings.js --apply
```

The catalog now uses provider-neutral rating fields: `criticRating` (IGDB's critic aggregate), `communityRating` (IGDB user score), and `userRating` (your personal score). To promote historic Metacritic values to `criticRating` while retaining the original field, run:

```shell
docker-compose exec backend node scripts/migrate-rating-fields.js
docker-compose exec backend node scripts/migrate-rating-fields.js --apply
```

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
