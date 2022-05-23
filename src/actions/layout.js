export const SET_LAYOUT = 'LAYOUT ACTION SET LAYOUT';

export const setLayout = data => {
    return {
        type: SET_LAYOUT,
        payload: data,
    }
}