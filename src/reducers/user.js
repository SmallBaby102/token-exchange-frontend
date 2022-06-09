import { SET_LOADING, SET_CURRENT_USER,SET_CURRENT_PATH, SET_DEPOSIT_ADDRESS, SET_CHECKING, LOGOUT, SET_USERS, SET_ACCOUNTS, SET_ACCOUNT_INTERVALID, SET_QUOTE_INTERVALID, SET_QUOTE } from "../actions";

const initialState = {
    user: null,
    users: [],
    loading: false,
    checking: false,
    accounts: [],
    accountIntervalId: null,
    quote: [],
    quoteIntervalId: null,
    btc_address: null,
    usdt_address: null,
    eth_address: null,
    currentPath: null,
    prrofileProgressState: false,
}
const user = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING: {
            return {
                ...state,
                loading: action.payload,
            }
        }
        case SET_CURRENT_PATH: {
            return {
                ...state,
                currentPath: action.payload,
            }
        }
        case SET_CURRENT_USER: {
            return {
                ...state,
                user: {...state.user, ...action.payload},
            }
        }
        case SET_DEPOSIT_ADDRESS: {
            return {
                ...state,
                ...action.payload,
            }
        }
        case SET_ACCOUNTS: {
            return {
                ...state,
                accounts: action.payload,
            }
        }
        case SET_ACCOUNT_INTERVALID: {
            return {
                ...state,
                accountIntervalId: action.payload,
            }
        }
        case SET_QUOTE: {
            return {
                ...state,
                quote: action.payload,
            }
        }
        case SET_QUOTE_INTERVALID: {
            return {
                ...state,
                quoteIntervalId: action.payload,
            }
        }
        case SET_CHECKING: {
            return {
                ...state,
                checking: action.payload,
            }
        }
        case LOGOUT: {
            return initialState;
        }
        case SET_USERS: {
            let users = action.payload.filter(ele => {
                return ele.id !== state.user.id;
            });
            return {
                ...state,
                users: users,
            }
        }
        default: {
            return state;
        }
    }
}

export default user;