FROM node:16

WORKDIR /back
COPY package.json /back
COPY yarn.lock /back
RUN yarn install --frozen-lockfile
COPY . /back
RUN npx prisma generate
RUN yarn build
CMD [ "yarn", "run", "start:prod" ]