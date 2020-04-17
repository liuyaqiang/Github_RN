import {combineReducers} from 'redux';
import popular from './popular';
import theme from './theme';
import trending from './trending'
const index = combineReducers({
        theme:theme,
        popular:popular,
        trending:trending,
    }
);
export default index;
