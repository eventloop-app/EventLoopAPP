import {exchangeCodeAsync, makeRedirectUri} from "expo-auth-session";
import storages from "./storages";
import axios from "react-native-axios";
import qs from "qs";

class Auth {
  onSignIn = async (token, codeVerifier) => {
    try {
      const {accessToken, refreshToken, idToken} = await exchangeCodeAsync({
        code: token,
        clientId: '4bf4a100-9aeb-42be-8649-8fd4ef42722b',
        redirectUri: makeRedirectUri({scheme: 'exp://fy-kbp.kangpla.eventloopapp.exp.direct:80'}),
        scopes: ["openid", "profile", "email", "offline_access"],
        grant_type: "authorization_code",
        extraParams: {
          code_verifier: codeVerifier
        },
      }, {
        tokenEndpoint: 'https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/oauth2/v2.0/token'
      })
      return await new Promise((resolve) => resolve({
        accessToken: accessToken,
        refreshToken: refreshToken,
        idToken: idToken
      }));
    } catch (e) {
      return await new Promise((reject) => reject({error: e}));
    }
  }

  onRefreshToken = async () => {
    console.log("Working")
    let refreshToken = ""
    await storages.getDataV2('user').then(res => {
      refreshToken = JSON.parse(res).refreshToken
    })
    const data = qs.stringify({
      'grant_type': 'refresh_token',
      'client_id': '4bf4a100-9aeb-42be-8649-8fd4ef42722b',
      'scope': 'https://graph.microsoft.com/.default',
      'refresh_token': refreshToken
    });
    try {
      return axios.post('https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/oauth2/v2.0/token', data, { 'Content-Type': 'application/x-www-form-urlencoded'})
    } catch (e) {
      console.log(e)
    }

  }
}

export default new Auth();
