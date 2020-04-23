export interface DiscoverUrlsDto {
  authorization_endpoint: string;
  id_token_signing_alg_values_supported: string[];
  issuer: string;
  jwks_uri: string;
  response_types_supported: string[];
  scopes_supported: string[];
  subject_types_supported: string[];
  token_endpoint: string;
  token_endpoint_auth_methods_supported: string[];
  userinfo_endpoint: string;
}
