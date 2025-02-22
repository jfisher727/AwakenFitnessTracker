import { useStorageState } from "@/store/useStorageState";

export const Client = Object.freeze({
    APP: "app",
    BROWSER: "browser"
});

type Settings = {
    client: "browser" | "app",
    baseUrl: string,
    withCredentials: boolean
};

export const settings: Settings = {
    client: Client.BROWSER,
    baseUrl: `/_allauth/${Client.BROWSER}/v1`,
    withCredentials: false
};

const ACCEPT_JSON = {
    accept: 'application/json'
};

export const URLs = Object.freeze({
    // Meta
    CONFIG: '/config',

    // Account management
    CHANGE_PASSWORD: '/account/password/change',
    EMAIL: '/account/email',
    PROVIDERS: '/account/providers',

    // Account management: 2FA
    AUTHENTICATORS: '/account/authenticators',
    RECOVERY_CODES: '/account/authenticators/recovery-codes',
    TOTP_AUTHENTICATOR: '/account/authenticators/totp',

    // Auth: Basics
    LOGIN: '/auth/login',
    REQUEST_LOGIN_CODE: '/auth/code/request',
    CONFIRM_LOGIN_CODE: '/auth/code/confirm',
    SESSION: '/auth/session',
    REAUTHENTICATE: '/auth/reauthenticate',
    REQUEST_PASSWORD_RESET: '/auth/password/request',
    RESET_PASSWORD: '/auth/password/reset',
    SIGNUP: '/auth/signup',
    VERIFY_EMAIL: '/auth/email/verify',

    // Auth: 2FA
    MFA_AUTHENTICATE: '/auth/2fa/authenticate',
    MFA_REAUTHENTICATE: '/auth/2fa/reauthenticate',

    // Auth: Social
    PROVIDER_SIGNUP: '/auth/provider/signup',
    REDIRECT_TO_PROVIDER: '/auth/provider/redirect',
    PROVIDER_TOKEN: '/auth/provider/token',

    // Auth: Sessions
    SESSIONS: '/auth/sessions',

    // Auth: WebAuthn
    REAUTHENTICATE_WEBAUTHN: '/auth/webauthn/reauthenticate',
    AUTHENTICATE_WEBAUTHN: '/auth/webauthn/authenticate',
    LOGIN_WEBAUTHN: '/auth/webauthn/login',
    SIGNUP_WEBAUTHN: '/auth/webauthn/signup',
    WEBAUTHN_AUTHENTICATOR: '/account/authenticators/webauthn'
});

export function getSessionToken() {
    const [state, setValue] = useStorageState("sessionToken");
    return [state, setValue];
}

async function request(method: string, path: string, data: any, headers: any, token: string | null) {
    const options: {
        method: string,
        headers: {
            accept: string,
            "User-Agent"?: string,
            "X-Session-Token": string,
            "Content-Type"?: string
        },
        credentials?: string,
        body?: string
    } = {
        method,
        headers: {
            ...ACCEPT_JSON,
            ...headers
        }
    }
    if (settings.withCredentials) {
        options.credentials = 'include';
    }
    // Don't pass along authentication related headers to the config endpoint.
    if (path !== URLs.CONFIG) {
        if (settings.client === Client.BROWSER) {
            // options.headers['X-CSRFToken'] = getCSRFToken()
            // need to figure out the CSRF token
        } else if (settings.client === Client.APP) {
            // IMPORTANT!: Do NOT use `Client.APP` in a browser context, as you will
            // be vulnerable to CSRF attacks. This logic is only here for
            // development/demonstration/testing purposes...
            options.headers['User-Agent'] = 'django-allauth example app';
            if (token) {
                options.headers['X-Session-Token'] = token;
            }
        }
    }

    if (typeof data !== 'undefined') {
        options.body = JSON.stringify(data);
        options.headers['Content-Type'] = 'application/json';
    }
    const url = process.env.EXPO_PUBLIC_API_URL + settings.baseUrl + path;
    const resp = await fetch(url, options);
    const msg = await resp.json();
    if (msg.status === 410) {
        // setToken(null);
        console.log('410 response');
    }
    if (msg.meta?.session_token) {
        //setToken(msg.meta.session_token);
        console.log('new session token?');
    }
    /*
    if ([401, 410].includes(msg.status) || (msg.status === 200 && msg.meta?.is_authenticated)) {
        const event = new CustomEvent('allauth.auth.change', { detail: msg });
        document.dispatchEvent(event);
    }
    */
    return msg;
}

export async function login(data: any) {
    return await request('POST', URLs.LOGIN, data, null, null);
}

export function setup(client: string, withCredentials: boolean) {
    if (client === 'app') {
        settings.client = Client.APP;
    }
    else {
        settings.client = Client.BROWSER;
    }
    settings.baseUrl = `/_allauth/${client}/v1`;
    settings.withCredentials = withCredentials;
}
