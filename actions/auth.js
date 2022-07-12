import {SIGN_IN_SUCCESS, SIGN_IN_FAIL, SIGN_OUT, REMOVE_USER, REFRESH_TOKEN} from "./types";
import Auth from "../services/auth";
import storages from "../services/storages";
import decode from "../services/decode";
import eventsService from "../services/eventsService";


export const SignIn = (token, codeverifier) => (dispatch) => {
  Auth.onSignIn(token, codeverifier).then(token => {
    const user = decode.jwt(token.idToken)
    eventsService.transferMemberData(user).then( res => {
      if(res.status === 200){
        storages.save('user', JSON.stringify({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          idToken: token.idToken
        }))
        dispatch({
          type: SIGN_IN_SUCCESS,
          payload: user
        })
      }
    }).catch(e => {
      console.log(e)
      dispatch({
        type: SIGN_IN_FAIL,
        payload: e
      })
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
  Auth.onRefreshToken().then(async res => {
    const {access_token,id_token,refresh_token} = res.data
    await storages.save('user', JSON.stringify({
      accessToken: access_token,
      refreshToken: refresh_token,
      idToken: id_token
    }))
    await dispatch({
      type: REFRESH_TOKEN
    })
  })
}
