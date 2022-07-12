export default class MyneClient {
    private isLoggedIn = false;
    private userToken: MyneAppSessionToken | undefined;

    private readonly MYNE_TOKEN_URL_PARAM = 'myneToken';
    private readonly MYNE_MANAGER_URL = 'https://app.myne.systems';

    /**
     * @constructor
     */
    constructor() {
        // check url parameter
        const urlParams = new URLSearchParams(location.search);

        if (urlParams.has(this.MYNE_TOKEN_URL_PARAM)) {
            this.userToken = this.parseToken(urlParams.get(this.MYNE_TOKEN_URL_PARAM)!);
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
    userLoggedIn(): boolean {
        return this.isLoggedIn;
    }

    /**
     * Opens a new window with the App registration page
     * @param {string} appId - The ID of your App Manifest
     * @param {string} redirectUrl - The URL where the user will be redirected after login
     * @returns {void}
     */
    openLoginPage(appId: string, redirectUrl: string) {
        window.location.href = `${this.MYNE_MANAGER_URL}/apps/app-manifest/view?appId=${appId}&register=true&redirectUrl=${redirectUrl}`;
    }

    /**
     * Logs out the user
     */
    async logout() {
        const response = await fetch(this.userToken!.myne_url + '/sessions/close', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.userToken!.auth_token}`,
                    'Content-Type': 'application/json',
                },
            }
        ).catch(e => {
            throw e;
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: response.statusText`);
        }

        localStorage.removeItem(this.MYNE_TOKEN_URL_PARAM);

        this.isLoggedIn = false;
        this.userToken = undefined;
    }

    /**
     * Execute an App Action as defined in the App Manifest
     * @param {string} actionName - Name of the Action, as defined in the App Manifest
     * @param {PropertyHashMap} actionQueryParams - Object representing query parameters key /value pair
     * @returns {MyneResponse} - The result of the Action's SGQL query
     */
    async executeAction<T extends PropertyHashMap, U extends PropertyHashMap>(actionName: string, actionQueryParams: PropertyHashMap): Promise<MyneResponse<T, U>> {
        if (!this.userToken) {
            throw new Error('User not logged in');
        }
        if (!actionName) {
            throw new Error('An action name must be specified');
        }

        const response = await fetch(this.userToken!.myne_url + '/actions/run', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.userToken!.auth_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action_name: actionName,
                    action_query_params: actionQueryParams
                })
            }
        ).catch(e => {
            throw e;
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: response.statusText`);
        }

        return response.json();
    }

    private parseToken(rawToken: string): MyneAppSessionToken {
        let tokenString = atob(rawToken);

        try {
            return JSON.parse(tokenString);
        } catch (e) {
            throw new Error('Error reading Myne Token string');
        }
    }
}

export interface MyneResponse<T extends PropertyHashMap, U extends PropertyHashMap> {
    nodes: MyneNode<T>[];
    relations: MyneRelation<U>[];
}

export interface MyneNode<T extends PropertyHashMap> {
    id: string;
    name: string;
    updated_at: string;
    authored_by: string;
    properties: T;
}

export interface MyneRelation<T extends PropertyHashMap> {
    id: string;
    name: string;
    updated_at: string;
    authored_by: string;
    node_in_id: string;
    node_out_id: string;
    properties: T;
}

export type HashMap<T> = { [key: string]: T };
export type PropertyHashMap = HashMap<string>;

export interface MyneAppSessionToken {
    user_id: string;
    app_id: string;
    myne_url: string;
    auth_token: string;
}
