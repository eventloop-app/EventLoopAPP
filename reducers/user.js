import {GETUSER_SUCCESS, GETUSER_FAIL, REMOVE_USER, SAVEUSER_SUCCESS} from '../actions/types'
import storages from "../services/storages";

let initialState = {
  user: null,
  userError: null
};
storages.getDataV2('user').then(res => {
  if(res){
    initialState.user = res
  }
})

export default function auth(state = initialState, action) {
  const {type, payload} = action;
  console.log(type)
  switch (type) {
    case SAVEUSER_SUCCESS:
      return {
        ...state,
        user: payload
      };
    case GETUSER_SUCCESS:
      return {
        ...state,
        user: payload
      };
    case GETUSER_FAIL:
      return {
        ...state,
        userError: payload,
      };
    case REMOVE_USER:
      return {
        user: null
      };
    default:
      return state;
  }
}
