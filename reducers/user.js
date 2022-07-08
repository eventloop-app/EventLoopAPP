import {GETUSER_SUCCESS, GETUSER_FAIL, REMOVE_USER} from '../actions/types'

const initialState = {
  userToken: null,
  userError: null
};

export default function auth(state = initialState, action) {
  const {type, payload} = action;
  switch (type) {
    case GETUSER_SUCCESS:
      return {
        ...state,
        userToken: payload,
      };
    case GETUSER_FAIL:
      return {
        ...state,
        userError: payload,
      };
    case REMOVE_USER:
      return {
        ...state,
        userToken: null,
      };
    default:
      return state;
  }
}
