import Types from '../Types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, handleData} from '../ActionUtil';

export function onLoadPupularData(storeName,url,pageSize,favoriteDao){
    return dispatch=>{
        dispatch({type:Types.POPULAR_REFRESH,storeName:storeName});
        let dataStore = new  DataStore();
        dataStore.fetchData(url,FLAG_STORAGE.flag_popular)
            .then(data=>{
                handleData(Types.POPULAR_REFRESH_SUCCESS,dispatch,storeName,data,pageSize,favoriteDao)
            })
            .catch(error=>{
                console.log(error);
                dipatch({
                    type:Types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error
                })
            })
    }

}
export function onLoadMorePupularData(storeName,pageIndex,pageSize,dataArray=[],favoriteDao,callback){
    return dispatch=>{
        setTimeout(()=>{
            if ((pageIndex-1)*pageSize>=dataArray.length){
                if (typeof  callback==='function'){
                    callback('no more')
                }
                dispatch({
                        type:Types.POPULAR_LOAD_MORE_FAIL,
                        error:'no more',
                        storeName:storeName,
                        pageIndex:--pageIndex,
                    })
            }else {
                let max=pageSize * pageIndex>dataArray.length?dataArray.length:pageSize*pageIndex;
                _projectModels(dataArray.slice(0,max),favoriteDao,data=>{
                    dispatch({
                        type:Types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels:data,
                    })
                })

            }

        },500);
    }
}

export function onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
    return dispatch=>{
        //本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max),favoriteDao,data=>{
            dispatch({
                type: Types.FLUSH_POPULAR_FAVORITE,
                storeName,
                pageIndex,
                projectModels: data,
            })
        })
    }
}
