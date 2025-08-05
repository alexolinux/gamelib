# Usa a imagem oficial do Node 20-alpine como base
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Expõe a porta que a aplicação irá rodar
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento (Vite)
CMD ["npm", "run", "dev", "--", "--host"]
