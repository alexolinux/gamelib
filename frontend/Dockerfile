# gamelib/frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# A porta 8080 será usada pelo servidor de desenvolvimento do Vite dentro do container
EXPOSE 8080

# Inicia o servidor de desenvolvimento do Vite.
# --host 0.0.0.0 permite que o servidor seja acessível de fora do container.
# --port 8080 define a porta para o servidor Vite.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]

