FROM node:16
WORKDIR /front
COPY package.json /front
COPY yarn.lock /front
RUN yarn install --frozen-lockfile
COPY . /front
RUN yarn build
CMD ["yarn", "preview", "--port", "3000", "--host"]