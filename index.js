var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("MyneClient", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MyneClient {
        /**
         * @constructor
         */
        constructor() {
            this.isLoggedIn = false;
            this.MYNE_TOKEN_URL_PARAM = 'myneToken';
            this.MYNE_MANAGER_URL = 'https://app.myne.systems';
            // check url parameter
            const urlParams = new URLSearchParams(location.search);
            if (urlParams.has(this.MYNE_TOKEN_URL_PARAM)) {
                this.userToken = this.parseToken(urlParams.get(this.MYNE_TOKEN_URL_PARAM));
                this.isLoggedIn = true;
                return;
            }
            // check local storage
            let rawToken = localStorage.getItem(this.MYNE_TOKEN_URL_PARAM);
            if (rawToken) {
                this.userToken = this.parseToken(rawToken);
                this.isLoggedIn = true;
                return;
            }
            console.warn("User not logged in");
        }
        /**
         * Checks whether the user is logged in
         * @returns {boolean} true if the user is logged in
         */
        userLoggedIn() {
            return this.isLoggedIn;
        }
        /**
         * Opens a new window with the App registration page
         * @param {string} appId - The ID of your App Manifest
         * @param {string} redirectUrl - The URL where the user will be redirected after login
         * @returns {void}
         */
        openLoginPage(appId, redirectUrl) {
            window.location.href = `${this.MYNE_MANAGER_URL}/apps/app-manifest/view?appId=${appId}&register=true&redirectUrl=${redirectUrl}`;
        }
        /**
         * Logs out the user
         */
        logout() {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield fetch(this.userToken.myne_url + '/sessions/close', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.userToken.auth_token}`,
                        'Content-Type': 'application/json',
                    },
                }).catch(e => {
                    throw e;
                });
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: response.statusText`);
                }
                localStorage.removeItem(this.MYNE_TOKEN_URL_PARAM);
                this.isLoggedIn = false;
                this.userToken = undefined;
            });
        }
        /**
         * Execute an App Action as defined in the App Manifest
         * @param {string} actionName - Name of the Action, as defined in the App Manifest
         * @param {PropertyHashMap} actionQueryParams - Object representing query parameters key /value pair
         * @returns {MyneResponse} - The result of the Action's SGQL query
         */
        executeAction(actionName, actionQueryParams) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.userToken) {
                    throw new Error('User not logged in');
                }
                if (!actionName) {
                    throw new Error('An action name must be specified');
                }
                const response = yield fetch(this.userToken.myne_url + '/actions/run', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.userToken.auth_token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action_name: actionName,
                        action_query_params: actionQueryParams
                    })
                }).catch(e => {
                    throw e;
                });
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: response.statusText`);
                }
                return response.json();
            });
        }
        parseToken(rawToken) {
            let tokenString = atob(rawToken);
            try {
                return JSON.parse(tokenString);
            }
            catch (e) {
                throw new Error('Error reading Myne Token string');
            }
        }
    }
    exports.default = MyneClient;
});
