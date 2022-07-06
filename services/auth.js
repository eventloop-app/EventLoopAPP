import {exchangeCodeAsync, makeRedirectUri} from "expo-auth-session";


class Auth {
  onSignIn = async (token,codeVerifier) => {
    try {
      const {accessToken, refreshToken, idToken} = await exchangeCodeAsync({
        code: token,
        clientId: '4bf4a100-9aeb-42be-8649-8fd4ef42722b',
        redirectUri: makeRedirectUri({}),
        scopes: ["openid", "profile", "email", "offline_access", "user.read"],
        grant_type: "authorization_code",
        extraParams: {
          code_verifier: codeVerifier
        },
      }, {
        tokenEndpoint: 'https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/oauth2/v2.0/token'
      })
      return await new Promise((resolve) => resolve({accessToken: accessToken, refreshToken: refreshToken, idToken: idToken}));
    }catch (e) {
      return await new Promise((reject) => reject({error: e}));
    }
  }
}
export default new Auth();
