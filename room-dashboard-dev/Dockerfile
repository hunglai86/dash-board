FROM node:22.1.0-alpine3.19

#Argument that is passed from docer-compose.yaml file
ARG PORT

# Create app directory
WORKDIR /usr/src/app

#Echo the argument to check passed argument loaded here correctly
RUN echo "Argument port is : $PORT"

# Get all the code needed to run the app
COPY . /usr/src/app

# Install dependecies
RUN npm install

# Expose the port the app runs in
EXPOSE ${PORT}

# Serve the app
CMD ["npm", "start"]