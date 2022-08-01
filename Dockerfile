FROM node:current-alpine3.10

# Create node-monitor directory
WORKDIR /usr/src/node-monitor

# Move source files to docker image
COPY . .

# Install dependencies
RUN yarn && yarn build

# Run
ENTRYPOINT yarn start $ARGS