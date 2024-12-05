# AWAP Movie Application

<p>
  
<img alt="Nodejs Badge" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />

<img alt="PostgreSQL Badge" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />

<img alt="Javascript Badge" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />

<img alt="Javascript Badge" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />

<img alt="PostgreSQL Badge" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" />

<img alt="PostgreSQL Badge" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/microsoft%20azure-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white" />

</p>

## :books: Table of the content

- [Introduction](#bulb-introduction)
- [Start](#rocket-start)
- [Video Demostration](#video_camera-video-demostration)
- [API document](#page_with_curl-api-document)
- [Deployment](#gear-deployment)
- [Contacts](#email-contacts)

## :bulb: Introduction

**MovieApp** is an application that users can browser the medias they are interested in, save and share the contents to their friends, or create a group to discuss about the newest trending movies.

## :rocket: Start

```sh
# clone the repository.
git clone https://github.com/AWAP-Group8-2024/Movie-App

# install the dependencies in the root folder for the frontend.
npm install

# change directory to the server folder.
cd server

# install the dependencies in the server folder for the backend.
npm install

# create environment variables in the root folder for the frontend.
echo  > .env
# environment variables for frontend.
REACT_APP_TMDB_API_KEY = TheAPIKeyFromTMDB
REACT_APP_TMDB_TOKEN = TheAPITokenFromTMDB
REACT_APP_TMDB_URL = https://api.themoviedb.org
REACT_APP_BACKEND_URL = http://localhost:5000

# create environment variables in the server folder for the backend.
cd server
echo  > .env

# environment variables for the backend.
PORT = 5000
SERVER_URL = http://localhost:5000
DB_USER = databaseUserName
DB_HOST = localhost
DB_NAME = databaseName
DB_PASSWORD = databasePassword
DB_PORT = 5432
JWT_SECRET = JWTSecretForEncryption
```

To run the app for development.

```sh
# run the backend under the server folder
cd server
npm run devStart

# run the frontend under root folder
npm start
```

To run the backend test script.

```sh
cd server
npm run test
```

## :video_camera: Video Demostration

tbd

## :page_with_curl: API document

The API document is called openAPI.json which is located on the /server folder.

## :gear: Deployment

#### GitHub secrets are needed for deploying on azure by using GitHub Actions.

```sh
# create GitHub secrets for GitHub Actions
gh secret set <secret_name> --body <secret_value> --env <environment_name>
# example:
gh secret set REACT_APP_TMDB_API_KEY --body TheAPIKeyFromTMDB --env development
# check the secrets have been created
gh secret list --env development
```

[Azure Portal](https://mango-rock-0b5b48e10.5.azurestaticapps.net/)

Of course you're very welcome to visit our site on Azure Portal and try it by yourself!

## :email: Contacts

- **Email**: Send us your questions or support requests.
  [Ahn Sungmin](mailto:asungmin24@students.oamk.fi)
  [Egor Ugriumov](mailto:t3ugeg00@students.oamk.fi)
  [Hamim Ifty](mailto:hifty24@students.oamk.fi)
  [Jasintha Weerappu Hettiarachchige](mailto:t3weja00@students.oamk.fi)
  [Roman Shrestha](mailto:t3shro00@students.oamk.fi)
  [Sam Chou](mailto:t3chsa01@students.oamk.fi)
