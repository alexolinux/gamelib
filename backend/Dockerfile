# Usa a imagem oficial do Node 20-alpine como base
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install --omit=dev

# Copia o resto do código da aplicação
COPY . .

# Expõe a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
