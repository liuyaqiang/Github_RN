import React, {Component} from 'react';
import {FlatList,ActivityIndicator,Button,StyleSheet,Text,View,RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import  actions from '../action/index';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import FetchDemoPage from './FetchDemoPage';
import {onLoadPupularData} from '../action/popluar';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import {DeviceInfo} from 'react-native';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';

const URL = 'https://api.github.com/search/repositories?q=' ;
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_pupular);
export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.tabNames=['Jave','Android','iOS','React','PHP',];

    }
    _genTabs(){
        const tabs={};
        this.tabNames.forEach((item,index)=>{
            tabs[`tab${index}`]={
                screen:props=><PopularTabPage{...props} tabLabel={item}/>,
                navigationOptions:{
                    title:item,
                }
            };
        });
        return tabs;
    }
    render(){
        let statusBar = {
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        };
        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style={{backgroundColor:THEME_COLOR}}
                />;
        const TabNavigator=createAppContainer(createMaterialTopTabNavigator(
             this._genTabs(),
            {
                    tabBarOptions:{
                        tabStyle:styles.tabStyle,
                        upperCaseLabel:false,
                        scrollEnabled:true,
                        style:{
                           backgroundColor:'#a67',
                            height:50,
                        },
                        indicatorStyle:styles,
                        labelStyle:styles.labStyle,
                    }
                }
        ));
        return(
            <View style={{
                flex:1,
                marginTop:30
            }}>
                {navigationBar}
                <TabNavigator></TabNavigator>
            </View>
        );
    }
}
const pageSize = 15;
class PopularTab extends Component{
    constructor(props) {
        super(props);
        const {tabLabel} = this.props;
        this.storeName = tabLabel;
    }
    componentDidMount(): void {
        this.loadData();
    }
    loadData(loadMore){
        const {onLoadPupularData,onLoadMorePupularData}=this.props;
        const store=this._store();
        const url=this.genFetchUrl(this.storeName);
        if (loadMore){
            onLoadMorePupularData(this.storeName,++store.pageIndex,pageSize,store.items,favoriteDao,callback=>{
                this.refs.toast.show("没有更多");
            })
        }else {
            onLoadPupularData(this.storeName,url,pageSize,favoriteDao);
        }
    }
    _store(){
        const {popular} = this.props;
        let store=popular[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
                hideLoadingMore: true,
            }
        }
        return store;
    }
    genFetchUrl(key){
        return URL + key + QUERY_STR;
    }
    renderItem(data){
        const  item =data.item;
        return <PopularItem
            projectModel={item}
            onSelect={()=>{
                NavigationUtil.goPage({
                    projectModel:item.item
                },'DetailPage')
            }}
            onFavorite={(item,isFavorite)=>FavoriteUtil.onFavorite(favoriteDao,item,isFavorite,FLAG_STORAGE.flag_pupular)}
        />
    }
    genIndicator(){
        return this._store().hideLoadingMore?null:
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                >
                </ActivityIndicator>
                <Text>
                    加载更多
                </Text>
            </View>
    }
    render(){

        const {popular} = this.props;
        let store=this._store();
        return(
            <View style={styles.container}>
                <FlatList data={store.projectModels}
                          renderItem={data=>this.renderItem(data)}
                          keyExtractor={item=>""+item.item.id}
                          refreshControl={
                              <RefreshControl
                                title={'Loading'}
                                titleColor={THEME_COLOR}
                                colors={[THEME_COLOR]}
                                refreshing={store.isLoading}
                                onRefresh={()=>this.loadData()}
                                tintColor={THEME_COLOR}
                              />
                          }
                          ListFooterComponent={()=>this.genIndicator()}
                          onEndReached={()=>{
                              console.log('----onEndReached----');
                              setTimeout(()=>{
                                  if (this.canLoadMore){
                                      this.loadData(true);
                                      this.canLoadMore = false;
                                  }
                              },100);
                          }}
                          onEndReachedThreshold={0.5}
                          onMomentumScrollBegin={()=>{
                              this.canLoadMore = true;//fix 初始化时滚动调用onMomentumScrollBegin
                              console.log('----onMomentumScrollBegin----')
                          }}
                ></FlatList>
                <Toast ref={'toast'}
                       position={'center'}
                />
            </View>
        )
    }
}
const mapStateToProps= state=> ({
    popular:state.popular,
});
const mapDispatchToProps= dispatch =>({
    onLoadPupularData:(storeName,url,pageSize,favoriteDao)=>dispatch(actions.onLoadPupularData(storeName,url,pageSize,favoriteDao)),
    onLoadMorePupularData:(storeName,pageInex,pageSize,items,favoriteDao,callBack)=>dispatch(actions.onLoadMorePupularData(storeName,pageInex,pageSize,items,favoriteDao,callBack)),
});
const PopularTabPage=connect(mapStateToProps,mapDispatchToProps)(PopularTab)

const styles=StyleSheet.create({
        container:{
            flex:1,
        },
        welcome:{
            fontSize:20,
            textAlign:'center',
            margin:10,
        },
        tabStyle:{
            // minWidth:50,
            padding:0
        },
        indicatorStyle: {
            height:2,
            backgroundColor:'white',
        },
        labelStyle: {
            fontSize: 13,
            margin:0
        },
        indicatorContainer:{
           alignItems:'center',
        },
        indicator:{
            color:'red',
            margin:10,
        }
    }
)
