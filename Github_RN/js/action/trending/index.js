import types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handleData} from '../ActionUtil';


export function onLoadTrendingData(storeName,url,pageSize){
    return dipatch=>{
        dipatch({type:types.TRENDING_REFRESH,storeName:storeName});
        let dataStore = new  DataStore();
        dataStore.fetchData(url,FLAG_STORAGE.flag_trending)
            .then(data=>{
                handleData(types.TRENDING_REFRESH_SUCCESS,dipatch,storeName,data,pageSize)
            })
            .catch(error=>{
                console.log(error);
                dipatch({
                    type:types.TRENDING_REFRESH,
                    storeName,
                    error
                })
            })
    }

}
export function onLoadMoreTrendingData(storeName,pageIndex,pageSize,dataArray=[],callback){
    return dispatch=>{
        setTimeout(()=>{
            if ((pageIndex-1)*pageSize>=dataArray.length){
                if (typeof  callback==='function'){
                    callback('no more')
                }
                dispatch({
                        type:types.TRENDING_LOAD_MORE_FAIL,
                        error:'no more',
                        storeName:storeName,
                        pageIndex:--pageIndex,
                        projectModels:dataArray,
                    })
            }else {
                let max=pageSize * pageIndex>dataArray.length?dataArray.length:pageSize*pageIndex;
                dispatch({
                    type:types.TRENDING_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels:dataArray.slice(0,max),
                })
            }

        },500);
    }
}
