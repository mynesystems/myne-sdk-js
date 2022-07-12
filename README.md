[<img width="200" alt="Myne logo" src="https://assets.myne.systems/logo/Myne-Logo-Small-Navy.png">](https://developers.myne.systems/)

**Myne SDK JS** is a JavaScript / TypeScript library to easily create privacy-first web applications using [Myne](https://www.Myne.systems).

This SDK provides many functionalities out-of-the-box to app developers such as:

- Authentication mechanism
- Managed Graph Database
- Micro-payments *(coming soon)*
- *More coming!*

## Installation

```shell
npm install myne-sdk
```

## Usage

### Login

First, instantiate the class `MyneClient`:

```typescript
const myneClient = new MyneClient();
```

It will automatically check if there is a token in the url of the current page, and if there are none, look for a stored session token in the `LocalStorage`.

Then, you should check if the user is logged in, otherwise redirect them to their Myne App:

```typescript
if (!myneClient.userLoggedIn()) {
    myneClient.openLoginPage('<your_app_id>', '<redirect_url>'); // this redirects the user to the Myne App
}
```

Once the user finishes the login process, it will be redirected to the page you specified above.

On that page, you should again create a new `MyneClient` that will get the session token in the url for you.

### Execute actions

Let's say you registered an application that has an action `listMovies` which takes the parameter `year`. You could execute it like so:

```typescript
myneClient
    .executeAction('listMovies', {year: '2022'})
    .then((response: MyneResponse) => {
        // Do something with the repsonse
    });
```

### Logout

You SHOULD provide a way for the user to logout, even though they can forcefully do so in the Myne App.

```typescript
myneClient.logout().then(() => {
    // redirect the user   
});
```

## API Reference

### The `MyneClient` class

This is the class that needs to be instantiated to interact with a user's Semantic Graph.

```typescript
interface MyneClient {
    userLoggedIn(): boolean;

    openLoginPage(appId: string, redirectUrl: string): void;

    logout(): Promise<void>;

    executeAction<T extends PropertyHashMap, U extends PropertyHashMap>(actionName: string, actionQueryParams: PropertyHashMap): Promise<MyneResponse<T, U>>;
}
```

### Methods

#### – `userLoggedIn(): boolean`

Returns `true` if the user is logged in, meaning a session token was found either in the URL of the page or in the `LocalStorage`


#### – `openLoginPage(appId: string, redirectUrl: string): void`

Opens the Myne App page and submit your App Manifest to user's approval. When the user accepts, they will be redirected to your website.

| Parameter     | Type     | Description                                                                                                   | 
|---------------|----------|---------------------------------------------------------------------------------------------------------------|
| `appId`       | `string` | The ID of your App Manifest. You can get an appId by registering your app on [Myne](https://app.myne.systems) |
| `redirectUrl` | `string` | The URI where the user will be redirected after login                                                         |


#### – `logout(): void`

Logs out the user, which means removing the session token from the `LocalStorage` and revoking the session on the user's Myne App


#### – `executeAction<T extends PropertyHashMap, U extends PropertyHashMap>(actionName: string, actionQueryParams: PropertyHashMap): Promise<MyneResponse<T, U>>`

Execute an action that is defined in your App Manifest.

Returns a [MyneResponse](./README.md#interfaces)

| Parameter             | Type     | Default | Description                                                                                                                                                                        | 
|-----------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `actionName`          | `string` |         | The name of the action to execute, as defined in your App Manifest                                                                                                                 |
| `actionQueryParams`   | `Object` |         | A set of `key: value` pairs, where the `key` is the name of a parameter as defined in your App Manifest in the `query_params`, and `value` its value                               |


### Interfaces

```typescript
interface MyneResponse<T extends PropertyHashMap, U extends PropertyHashMap> {
    nodes: MyneNode<T>[];
    relations: MyneRelation<U>[];
}

interface MyneNode<T extends PropertyHashMap> {
    id: string;
    name: string;
    updated_at: string;
    authored_by: string;
    properties: T;
}

interface MyneRelation<T extends PropertyHashMap> {
    id: string;
    name: string;
    updated_at: string;
    authored_by: string;
    node_in_id: string;
    node_out_id: string;
    properties: T;
}

type HashMap<T> = { [key: string]: T };
type PropertyHashMap = HashMap<string>;
```

## License

Copyright© 2022 Myne

All rights reserved.

Myne SDK JS's licence is based on the Apache 2.0, and its usage falls under and must be compliant with our Terms of Service.