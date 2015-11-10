## Dictionaries Microservice

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

If a user is trying to access a resource that's not his a 403 is returned with body:

```json
{ "error_code": "forbidden", "error_msg": "You are not allowed to access this scope" }
```

If the scope is not "users" neither "accounts" a 400 is returned with body:

```json
{ "error": "scope does not have a valid value" }
```