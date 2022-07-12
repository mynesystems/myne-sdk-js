declare module "MyneClient" {
    export default class MyneClient {
        private isLoggedIn;
        private userToken;
        private readonly MYNE_TOKEN_URL_PARAM;
        private readonly MYNE_MANAGER_URL;
        /**
         * @constructor
         */
        constructor();
        /**
         * Checks whether the user is logged in
         * @returns {boolean} true if the user is logged in
         */
        userLoggedIn(): boolean;
        /**
         * Opens a new window with the App registration page
         * @param {string} appId - The ID of your App Manifest
         * @param {string} redirectUrl - The URL where the user will be redirected after login
         * @returns {void}
         */
        openLoginPage(appId: string, redirectUrl: string): void;
        /**
         * Logs out the user
         */
        logout(): Promise<void>;
        /**
         * Execute an App Action as defined in the App Manifest
         * @param {string} actionName - Name of the Action, as defined in the App Manifest
         * @param {PropertyHashMap} actionQueryParams - Object representing query parameters key /value pair
         * @returns {MyneResponse} - The result of the Action's SGQL query
         */
        executeAction<T extends PropertyHashMap, U extends PropertyHashMap>(actionName: string, actionQueryParams: PropertyHashMap): Promise<MyneResponse<T, U>>;
        private parseToken;
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
    export type HashMap<T> = {
        [key: string]: T;
    };
    export type PropertyHashMap = HashMap<string>;
    export interface MyneAppSessionToken {
        user_id: string;
        app_id: string;
        myne_url: string;
        auth_token: string;
    }
}
