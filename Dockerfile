FROM node:20.4.0

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the entire application code to the container
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
