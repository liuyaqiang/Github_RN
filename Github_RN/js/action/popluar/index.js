import types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, handleData} from '../ActionUtil';

export function onLoadPupularData(storeName,url,pageSize,favoriteDao){
    return dipatch=>{
        dipatch({type:types.POPULAR_REFRESH,storeName:storeName});
        let dataStore = new  DataStore();
        dataStore.fetchData(url,FLAG_STORAGE.flag_pupular)
            .then(data=>{
                handleData(types.POPULAR_REFRESH_SUCCESS,dipatch,storeName,data,pageSize,favoriteDao)
            })
            .catch(error=>{
                console.log(error);
                dipatch({
                    type:types.POPULAR_REFRESH_FAIL,
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
                        type:types.POPULAR_LOAD_MORE_FAIL,
                        error:'no more',
                        storeName:storeName,
                        pageIndex:--pageIndex,
                    })
            }else {
                let max=pageSize * pageIndex>dataArray.length?dataArray.length:pageSize*pageIndex;
                _projectModels(dataArray.slice(0,max),favoriteDao,data=>{
                    dispatch({
                        type:types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels:data,
                    })
                })

            }

        },500);
    }
}

