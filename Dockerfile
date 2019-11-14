FROM node:10.0.0-alpine
RUN npm install -g npm@6.4.1

WORKDIR /srv/app

# Install node modules (allows for npm install to be cached until package.json changes)
COPY package.json package-lock.json .npmrc ./
RUN npm install

# Copy our source files to the service location
COPY src ./src
COPY test ./test
COPY .babelrc .eslintrc .prettierrc jest.config.json ./

# Copy the files required for npm pack (see package.json files section)
COPY config ./config
COPY bin ./bin
COPY backend-utils.js register.js dsm-storybook.d.ts ./

# Set default environment variables
ENV \
	PATH=/srv/app:/srv/app/node_modules/.bin:/bin:$PATH\
	DEBUG=false\
	PORT=80

# Start the server
CMD ["npm", "start"]