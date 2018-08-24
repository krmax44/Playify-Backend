# Playify-Backend
The backend of Playify.

<a href="https://app.codacy.com/project/krmax44/Playify-Backend/dashboard"><img src="https://img.shields.io/codacy/grade/ea57bbc2f47a46a9b89edc0258df69ad.svg"></a>

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
