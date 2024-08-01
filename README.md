## snake-assignment

Pre-requisites

- Node: v20.16.0
- Package Manager: NPM 10.8.2
- Docker Container running Redis

Sample `.env` file on the root

```
PORT=3000
REDIS_PORT=6379
REDIS_HOST=localhost
```

Scripts
`npm run dev`: start local development environment
`npm run start`: build and start production build

To start locally: `npm i && npm run dev`

---

💡 Assumptions made

1. User can continue game if they call `/validate` with valid ticks and no rule violation, but did not get fruit. These calls will receive 404 but its assumed to leave for the client side to implement the UX. This case shouldn't happen in game, since `/validate` is only called when user reaches the fruit, but ive tested it on backend for fail safe just in case.
2. User cannot 180 degree reverse their move. Based on the usual Snake gameplay, the snake stays at the same position after catching a fruit. However, since the `State` structure does not keep track of the previous round's last velocity, the validation check to prevent 180 degree turn is skipped for all the 1st ticks in the set.

Due to time constrains 😅

- Not testing redis interactions
- Not testing extensively for json payload in api tests (Most are unit tested in individual functions)
- Did not separate test environment use of redis with development environment
