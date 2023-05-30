# Boilerplate GraphQL

## Features

The application has some features, namely `user creation`, `authentication` and search for `currency conversion`.

- `User creation` is done in a simple way using bcrypt to generate hash's and encrypt passwords, it is also used together with JWT to create access token.

- `Authentication` JWT and Passport resources are used for user token generation and validation. Passport JWT allows me to authenticate each endpoint of my application using JWT in a very easy way, being very flexible and being able to create specific rules for each endpoint in particular.

## Install

Before all, update the .env.default file for the project to work. To install, just run docker on your machine and then run the following commands. (First docker compose and then npm install)

```
docker compose up -d

npm install
```

## Test

```
npm test
```

## Run

```
npm run start:dev
```