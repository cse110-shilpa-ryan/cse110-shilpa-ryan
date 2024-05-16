# User Accounts & Login

## Context and Problem Statement

A major consideration for the project is whether or not to implement user accounts & login. This is a decision that should be made early, as it will determine how end users will interact with our application, how we store and interact with data, the overall structure of our backend.

With user accounts, only users with account credentials would be allowed to create, edit, and delete their journal entries. Further applications brainstormed include project management capabilities and collaboration between different users.

## Considered Options

* Develop without framework 
  * User data would be hosted on a remote server (SQL or NoSQL), not locally (JSON)
  * Website interactions with server would be facilitated with PHP 
  * Information between server and client should be encrypted
* Third Party Authenticator or Develop with framework
  * Use a third party authenticator (Auth0) to handle all user interactions

## Decision Outcome

We decided that implementing user accounts would be too much to learn for a feature that is not core to our application. 