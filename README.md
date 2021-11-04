# yc-api

## Contents

- [About this Repository](#about-this-repository)
- [Install and Setup Instructions](#install-and-setup-instructions)

## About this Repository

This repository holds a NodeJS Express API that runs javascript services which cannot run in a browser environment; namely uploading site files and directories to an IPFS node. It also handles pinning Notes to IPFS if the user sending a Note is not using their own Pinata keys.

The repository hosts code for an SQLite database with two tables; one table that holds some information on Notes that have been uploaded via the API service, and one that holds some information on Sites that have been uploaded via the API service. Databases are not stored in the remote repository; each instance of this API will have its own database. The database is intended solely for computing some basic statistics on the Sites and Notes that are uploaded through a given instance of the API, and thus does not contain any personal information. The table schemas are held in `/app/models/`.

The API service, as well as the UI, integrates Sentry for error tracking and event management. Learn more about Sentry.io on their website https://sentry.io. If you are running your own instance of the backend or the UI, we recommend that you create your own Sentry account to be better able to track errors in your own instance.

## Install and Setup Instructions

### 1. Clone this Repository

```
git clone https://github.com/YibanChen/yc-api.git && cd yc-api
```

### 2. Create a .env File

Before creating this file, you must set up a Pinata account. Go to https://pinata.cloud, create an account, and get your API keys.

In the root directory of the project, create a file called `.env` with the following contents (replace \<YOUR PINATA KEY\> and \<YOUR PINATA SECRET KEY\> with your own Pinata keys):

```
NODE_ENV=DEVELOPMENT
PORT=5000
PINATA_KEY=<YOUR PINATA KEY>
PINATA_SECRET_KEY=<YOUR PINATA SECRET KEY>
SENTRY_KEY=https://3794051e4acf4e15a3cd5f5c2d1dad1f@o982640.ingest.sentry.io/5938147
```

### 3. Build the Docker Image

```
docker build . -t yibanchen/ipfs-and-backend
```

### 4. Run the Image

```
docker run -p 5000:5000 yibanchen/ipfs-and-backend
```

### 5. Test the Server

```
curl -i localhost:5000
```

expected response:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 35
ETag: W/"23-nY+yrT5sUeihHDpF4qrZQTbUWLU"
Date: Wed, 27 Oct 2021 19:59:23 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Welcome to YibanChen."}%
```
