export interface claims {
    at_hash?: string;
    aud?: string;
    auth_time?: number;
    "cognito:groups"?: string[];
    "cognito:username"?: string;
    email?: string;
    email_verified?: boolean;
    exp?: number;
    iat?: number;
    iss?: string;
    nonce?: string;
    sub?: string;
    token_use?: string;
}