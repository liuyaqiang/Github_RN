import types from '../../action/Types';
const defaultState={
    theme:'red',
};
export default function onAction(state=defaultState,action) {
    switch (action.type) {
        case types.THEME_CHANGE:
            return {
                ...state,
                theme: action.theme
            }
        default:
            return state;
    }
}
