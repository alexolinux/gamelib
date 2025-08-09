# gamelib

---------

A web application for managing your video game collection.

## Features

- Manage your console and game collections
- Search for console games on [RAWG.io](https://rawg.io) and add them to your collection
- Add games manually
- Filter games by console, status, and wishlist
- Sort games by name, release date, and metacritic rating
- Rate games

## Requirements

- `docker` and  `docker-compose`
- [RAWG.io](https://rawg.io/apidocs) API key to your request

## Structure

The application consists of the following containerized microservices:

- **Database**:   MongoDB (Latest)
- **Backend**:    NodeJS v20 Express
- **Frontend**:   NodeJS v20 + React + Vite + Tailwindcss

## How to run

Clone the repository using the provided URL:

```shell
git clone https://github.com/alexolinux/gamelib.git
```

Navigate into the project directory:

```shell
cd gamelib
```

Create `.env` file containing the required variables (see *`env.template`* template file).

```shell
# Load .env using the following command
source .env
```

Use Docker Compose to build and start the application. This command will handle setting up both the backend and frontend services.

```shell
docker-compose up --build
```

Or as Daemon

```shell
docker-compose up -d --build
```

You can check the services with the following command

```shell
docker-compose ps
```

Once the build is complete, you can access the application by navigating to <http://localhost:5173> in your web browser.

## Credits

All credit to my great friend and brother **[Tiago-S-Ribeiro](https://github.com/Tiago-S-Ribeiro)**. Tiago is the holder of the original idea.

## Author

[Alex Mendes](https://alexolinux.com/)

**LinkedIn**: [AlexMendes](https://www.linkedin.com/in/mendesalex)
