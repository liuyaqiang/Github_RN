import types from '../Types';

export function onThemeChange(theme){
    return {type:types.THEME_CHANGE,theme:theme};

}
