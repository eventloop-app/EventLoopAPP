import {GETUSER_SUCCESS, GETUSER_FAIL} from "./types";
import storages from "../services/storages";

export const getUserToken = () => (dispatch) => {
  return storages.getData('user').then( res => {
    if(res !== undefined){
      dispatch({
        type: GETUSER_SUCCESS,
        payload: res
      })
    }else{
      dispatch({
        type: GETUSER_FAIL,
        payload: 'Undefined user token'
      })
    }
  }).catch( (error) => {
    dispatch({
      type: GETUSER_FAIL,
      payload: error
    })
  })
}
