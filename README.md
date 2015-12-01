# Dictionaries Microservice

## The current production API

### Visiting the swagger

It can be found [here](https://dev4.workshare.com/dictionaries/swagger-ui/index.html). In order for it to work replace the top input's value with https://dev4.workshare.com/dictionaries/api/v1.0/swagger_doc.json

### Creating dictionaries

- Create a KEY-VALUE pair for a scope (USERS_OR_ACCOUNTS) with given UUID, where KEY is a string and VALUE a json object and uuid is the user/account uuid or the string "current":

```bash
curl -H 'Cookie: dev4_session_id=DEV4_SESSSION_ID_COOKIE_VAL;’ -H 'Content-Type: application/json' -d ‘VALUE’ -X PUT 'https://dev4.workshare.com/dictionaries/api/v1.0/USERS_OR_ACCOUNTS/UUID/dictionaries/KEY.json'
```

- Get it:

```bash
curl -H 'Cookie: dev4_session_id=DEV4_SESSION_ID_COOKIE_VAL;' 'https://dev4.workshare.com/dictionaries/api/v1.0/USERS_OR_ACCOUNTS/UUID/dictionaries/KEY.json'
```

If not found a 404 is returned.

- Get all key-value pairs for a given UUID:

```bash
curl -H 'Cookie: dev4_session_id=DEV4_SESSION_ID_COOKIE_VAL;' 'https://dev4.workshare.com/dictionaries/api/v1.0/USERS_OR_ACCOUNTS/UUID/dictionaries.json'
```

An extra filters parameter can be provided with form-encoded filter data (i.e filters[folder_id]=123).

```bash
curl -H 'Cookie: dev4_session_id=DEV4_SESSION_ID_COOKIE_VAL;' 'https://dev4.workshare.com/dictionaries/api/v1.0/USERS_OR_ACCOUNTS/UUID/dictionaries.json?filters%5Bdealroom-fe-timeline%5D=true'
```

- Delete a key-value pair:

```bash
curl -H 'Cookie: dev4_session_id=DEV4_SESSION_ID_COOKIE_VAL;' 'https://dev4.workshare.com/dictionaries/api/v1.0/USERS_OR_ACCOUNTS/UUID/dictionaries/KEY.json' -X DELETE
```

If not found a 404 is returned.

### Observations

If the user is not logger in a 401 is returned with body:

```json
{ "error_code": "not_logged_in", "error_msg": "Not logged in" }
```

If a user is trying to access a resource that's not his a 403 is returned with body:

```json
{ "error_code": "forbidden", "error_msg": "You are not allowed to access this scope" }
```

If the scope is not "users" neither "accounts" a 400 is returned with body:

```json
{ "error": "scope does not have a valid value" }
```

## Installing this Repo

Run:

```bash
npm install
```

If npm fails while installing the mongo driver please follow the instructions [here](http://mongodb.github.io/node-mongodb-native/2.0/getting-started/installation-guide/). If on mac make sure you have accepted the Xcode license agreement.

### Wiring thing in local environments

Session cookies comming from Cirrus are marked as secure and scoped in the .workshare.com domain.
Therefore, in order to have them accessible from the browser both ssl and being in the same
domain are mandatory.

For that reason if you are developing in a local machine you may want to teak your /etc/hosts file by adding something like:

```bash
127.0.0.1 localhost.workshare.com
```

Also a fake ssl certificate has to be set up in the public directory that would mock
the one that is expected to be present in production.

Access the API using that host instead and ignore the warning about security.
