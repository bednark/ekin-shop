FROM node:22-alpine AS base

RUN npm install -g npm@11.0.0
RUN npm install -g pnpm

FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build
RUN pnpm prune --prod

FROM base

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 next
RUN adduser --system --uid 1001 next

COPY --from=builder --chown=next:next /app /app

USER next

EXPOSE 3000

ENTRYPOINT [ "pnpm", "start" ]