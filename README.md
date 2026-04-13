# 🎮 Gamelib

A smooth, modern web application for managing your video game collection. Built with Node.js, React, and Tailwind CSS.

## ✨ Features

- **Multi-Device Support**: Fully responsive design for Smartphones, Tablets, and Desktops.
- **Collection Management**: Easily organize your consoles and games.
- **RAWG.io Integration**: Search and add games directly from the RAWG database.
- **Filter & Sort**: Organize your library by status, metacritic score, and release date.
- **Wishlist**: Keep track of the games you want to play next.

## 🚀 Requirements

- `docker` and `docker-compose`
- [RAWG.io](https://rawg.io/apidocs) API key.

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
   # Edit .env with your RAWG_API_KEY
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

**Alex Mendes** - [alexolinux.com](https://alexolinux.com/)
- [LinkedIn](https://www.linkedin.com/in/mendesalex)

---
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
