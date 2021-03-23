import { REGISTER_SUCCES,REGISTER_FAIL} from "../actions/types";

const  initialState= {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function (state= initialState,action){
    const {type,paylaod} = action;
    switch (type){
        case REGISTER_SUCCES:
            localStorage.setItem('token',paylaod.tocken);
            return {
                ...state,
                ...paylaod,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
            localStorage.removeItem('tocken');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        default:
            return state;

    }
}