# Hacker News Clone

## Introduction

This is a personal project that aims to consume data from the Hacker News site using their current API (v0) and store that data in a Postgresql database. This will be managed by a piece of software that will be responsible for polling the API and adding new data or modifying existing data within the database.

Following that, a GraphQL endpoint will be created to expose the data from the Postgresql database in a more developer friendly way.

Finally, a web site, mobile app and possibly a desktop app will be created to present the data.

The database, api consumption software, GraphQL and webserver will all be running on a Raspberry Pi for usage over a home network. It can of course be deployed to a public facing server at a later time.

**To do: Update this readme with more pertinent information as the project develops.**
