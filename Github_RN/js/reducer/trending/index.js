import Types from '../../action/Types';
const defaultState={
};

export default function onAction(state=defaultState,action) {
    switch (action.type) {
        case Types.TRENDING_REFRESH_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items:action.items,//原始数据
                    projectModels: action.projectModels,//要展示的数据
                    isLoading: false,
                    hideLoadingMore: false,
                    pageIndex:action.pageIndex,
                },
            };
        case Types.TRENDING_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                    hideLoadingMore: true,
                    pageIndex:action.pageIndex,
                },
            };
        case Types.TRENDING_REFRESH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    pageIndex:action.pageIndex,

                },
            };
        case Types.TRENDING_LOAD_MORE_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels:action.projectModels,
                    hideLoadingMore: false,
                    isLoading: false,
                    pageIndex:action.pageIndex,
                },
            };
        case Types.TRENDING_LOAD_MORE_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    isLoading: false,
                    pageIndex:action.pageIndex,
                },
            };
        case Types.TRENDING_FLUSH_FAVORITE:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels:action.projectModels,
                },
            };
        default:
            return state;
    }
}
