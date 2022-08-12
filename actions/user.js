import {GETUSER_SUCCESS, GETUSER_FAIL, SAVEUSER_SUCCESS} from "./types";
import storages from "../services/storages";

export const getUser = () => (dispatch) => {
  return storages.getDataV2('user').then( res => {
    if(res !== undefined){
      console.log("GET USER")
      dispatch({
        type: GETUSER_SUCCESS,
        payload: res
      })
    }else{
      console.log("GET USER FAIL")
      dispatch({
        type: GETUSER_FAIL,
        payload: 'Undefined user'
      })
    }
  }).catch( (error) => {
    dispatch({
      type: GETUSER_FAIL,
      payload: error
    })
  })
}

export const saveUser = (data) => (dispatch) => {
  storages.save('user',data)
      dispatch({
        type: SAVEUSER_SUCCESS,
        payload: data
      })
}
