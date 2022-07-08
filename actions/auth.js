import {SIGN_IN_SUCCESS, SIGN_IN_FAIL, SIGN_OUT, REMOVE_USER, REFRESH_TOKEN} from "./types";
import Auth from "../services/auth";
import jwt_decode from "jwt-decode";
import storages from "../services/storages";
import decode from "../services/decode";


export const SignIn = (token, codeverifier) => (dispatch) => {
  Auth.onSignIn(token, codeverifier).then(res => {
    const user = decode.jwt(res.idToken)
    storages.save('user', JSON.stringify({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      idToken: res.idToken
    }))
    dispatch({
      type: SIGN_IN_SUCCESS,
      payload: user
    })
  }).catch(e => {
    console.log(e)
    dispatch({
      type: SIGN_IN_FAIL,
      payload: e
    })
  })
}

export const SignOut = () => (dispatch) => {
  try {
    storages.remove('user')
    dispatch({
      type: SIGN_OUT
    })
    dispatch({
      type: REMOVE_USER
    })
  } catch (e) {
    console.log("SignOutError: " + e)
  }
}

export const refreshToken = () => (dispatch) => {
  console.log("REFRESH!!")
  Auth.onRefreshToken().then(res => {
    const {access_token,id_token,refresh_token} = res.data
    storages.save('user', JSON.stringify({
      accessToken: access_token,
      refreshToken: refresh_token,
      idToken: id_token
    }))
    dispatch({
      type: REFRESH_TOKEN
    })
  })
}
