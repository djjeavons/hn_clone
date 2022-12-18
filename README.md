# Hacker News Clone

## Contents

[Introduction](#Introduction)
[Environment Variables](#Environment-variables)

## Introduction

This is a personal project that aims to consume data from the Hacker News site using their current API (v0) and store that data in a Postgresql database. This will be managed by a piece of software that will be responsible for polling the API and adding new data or modifying existing data within the database.

Following that, a GraphQL endpoint will be created to expose the data from the Postgresql database in a more developer friendly way.

Finally, a web site, mobile app and possibly a desktop app will be created to present the data.

The database, api consumption software, GraphQL and webserver will all be running on a Raspberry Pi for usage over a home network. It can of course be deployed to a public facing server at a later time.

## Environment variables

There is a .env file required that contains the following keys.

- POSTGRES_USER = _Your postgres user name_
- POSTGRES_PASSWORD = _Your postgres password_
- POSTGRES_HOST = _The host name/ip address of the postgres server_
- POSTGRES_PORT = _The port of the postgres server_
- POSTGRES_DATABASE = _The name of the database_
- HN_ITEM_ROOT_URL = https://hacker-news.firebaseio.com/v0/item
- HN_TOP_STORIES_URL = https://hacker-news.firebaseio.com/v0/topstories.json
- HN_NEW_STORIES_URL = https://hacker-news.firebaseio.com/v0/newstories.json
- HN_BEST_STORIES_URL = https://hacker-news.firebaseio.com/v0/beststories.json
- HN_ASK_STORIES_URL = https://hacker-news.firebaseio.com/v0/askstories.json
- HN_JOB_STORIES_URL = https://hacker-news.firebaseio.com/v0/jobstories.json
- HN_SHOW_STORIES_URL = https://hacker-news.firebaseio.com/v0/showstories.json

**To do: Update this readme with more pertinent information as the project develops.**
