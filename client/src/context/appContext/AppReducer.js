const AppReducer = (state, actions) => {
    switch (actions.type) {
        case "EMPTY_STATE":
            return {
                authenticated: false,
                user: null,
                error: false
            };
        case "FETCH_SUCCESS":
            return {
                authenticated: true,
                user: actions.payload,
                error: false
            };
        case "FETCH_FAILED":
            return {
                authenticated: false,
                user: null,
                error: actions.payload
            };
        default:
            return state;
    }
}
export default AppReducer;