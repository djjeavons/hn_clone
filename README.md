# Hacker News Clone

## Contents

[Introduction](#Introduction)  
&nbsp;&nbsp;&nbsp;&nbsp;[Data Consumption](#Data-Consumption)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Command Line Arguments](#Command-Line-Arguments)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Database Tables](#Database-Tables)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Environment Variables](#Environment-variables)

## Introduction

This is a personal project that aims to consume data from the Hacker News site using their current API (v0) and store that data in a Postgresql database. This will be managed by a piece of software that will be responsible for polling the API and adding new data or modifying existing data within the database.

Following that, a GraphQL endpoint will be created to expose the data from the Postgresql database in a more developer friendly way.

Finally, a web site, mobile app and possibly a desktop app will be created to present the data.

The database, api consumption software, GraphQL and webserver will all be running on a Raspberry Pi for usage over a home network. It can of course be deployed to a public facing server at a later time.

## Data Consumption

To store data locally in a Postgresql database, a data consumption application developed in Node.js is used. This essentially calls the Hacker News API, fetches the data and then stores that data into one of two tables (Items or Comments).

Command line arguments are accepted to manage what type of items are processed and how many.

### Command Line Arguments

There are two commands available on the command line:

1. Get
2. Refresh

The Get command allows you to specify a type (story type) to retrieve and also whether to retrieve items that are newer than the last stored id in the database. These are accessed via the -t and -l flags respectively.

See get -h for more information.

The Refresh command takes a specific item identifier and retrieves that item from Hacker News and updates the database.

### Database Tables

As mentioned, there are two tables:

1. Items
2. Comments

**Items** stores all stories (top, ask, show etc.)  
**Comments** stores all associated comments to an item. Note, that this table has a parenttype column which specifies the type of its parent. For root comments, the type will be story, ask, show. However, for replies to comments the parenttype will be comment. The Data consumption program recursively collects all comments for an item allowing for a hierarchical storage and retrieval of comments.

### Environment variables

There is a .env file required that contains the following keys and values.

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
