import { SET_LAYOUT } from '../actions';

const initState = {
    theme: 'light',
}

const layout =  (state = initState, action) => {
    switch (action.type) {
        case SET_LAYOUT: {
            return {
                ...state,
                theme: action.payload,
            }
        }
        default: {
            return state;
        }
    }
}

export default layout;