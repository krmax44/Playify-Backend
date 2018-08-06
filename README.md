# Playify-Backend
The backend of Playify.

The public Playify backend is only intended for use with Playify itself. Please, do **NOT** use it for your own apps. Instead, host an instance yourself.

## Setup
Set your credentials obtained from Spotify to the environment variables `CLIENTID` and `CLIENTSECRET`. Then, run:

```
$ yarn install
$ yarn start
```

or with npm:
```
$ npm install
$ npm start
```

## API Documentation

The REST API is very simple. Send a `GET` request to one of the following endpoints...

 - `album`
 - `artist`
 - `track`

...with the query parameter `id` (a Spotify ID) to get a response. The `playlist` endpoint requires additionally a `userId` query param, which is the username of the playlist creator.