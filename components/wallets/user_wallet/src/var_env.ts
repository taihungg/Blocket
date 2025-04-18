const var_env: any = await fetch('http://localhost:3000/get_server_env');
const gg_client_id = var_env.GOOGLE_CLIENT_ID;
const gg_redirect_uri = var_env.GOOGLE_REDIRECT_URI;
const sui_endpoint = var_env.sui_endpoint;

export {
    gg_client_id,
    gg_redirect_uri,
    sui_endpoint,
}