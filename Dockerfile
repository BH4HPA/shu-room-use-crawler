FROM node:18

RUN export https_proxy=http://172.20.0.1:33000 http_proxy=http://172.20.0.1:33000 all_proxy=socks5://172.20.0.1:33000

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN corepack enable

RUN yarn config set strict-ssl false

RUN yarn install

RUN yarn build

CMD ["yarn", "start"]