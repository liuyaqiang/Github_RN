import React, {Component} from 'react';
import {DeviceEventEmitter,TouchableOpacity,FlatList,ActivityIndicator,Button,StyleSheet,Text,View,RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import  actions from '../action/index';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import FetchDemoPage from './FetchDemoPage';
import {onLoadPupularData} from '../action/popluar';
import TrendingItem from '../common/TrendingItem';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import TrendingDialog,{TimeSpans} from '../common/TrendingDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import PopularItem from '../common/PopularItem';

const URL = 'https://github.com/trending/' ;
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';

let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.tabNames=['C','C#','PHP','JaveScript',];
        this.state={
            timeSpan:TimeSpans[0],
        }
    }
    _genTabs(){
        const tabs={};
        this.tabNames.forEach((item,index)=>{
            tabs[`tab${index}`]={
                screen:props=><TrendingTabPage{...props} timeSpan={this.state.timeSpan} tabLabel={item}/>,
                navigationOptions:{
                    title:item,
                }
            };
        });
        return tabs;
    }
    renderTitleView(){
        return <View>
            <TouchableOpacity
                underlayColor = 'transparent'
                onPress={()=>this.dialog.show()}
            >
                <View style = {{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{
                        fontSize:18,
                        color:'#FFFFFF',
                        fontWeight:'400'
                    }}>趋势{this.state.timeSpan.showText}</Text>
                    <MaterialIcons
                        name={'arrow-drop-down'}
                        size={22}
                        style={{color:'white'}}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }
    onSelectTimeSpan(tab){
        this.dialog.dismiss();
        this.setState({
            timeSpan:tab
        })
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE,tab);
    }
    renderTrendingDialog(){
        return<TrendingDialog
            ref = {dialog=>this.dialog=dialog}
            onSelect={tab=>this.onSelectTimeSpan(tab)}
        ></TrendingDialog>
    }
    _tabNav(){
        if (!this.tabNav){
            this.tabNav=createAppContainer(createMaterialTopTabNavigator(
                this._genTabs(),
                {
                    tabBarOptions:{
                        tabStyle:styles.tabStyle,
                        upperCaseLabel:false,
                        scrollEnabled:true,
                        style:{
                            backgroundColor:'#a67',
                        },
                        indicatorStyle:styles,
                        labelStyle:styles.labStyle,
                    }
                }
            ));
        }
       return this.tabNav;
    }
    render(){
        let statusBar = {
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        };
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{backgroundColor:THEME_COLOR}}
        />;

        const TabNavigatior = this._tabNav();
        return(
            <View style={{
                flex:1,
                marginTop:30
            }}>
                {navigationBar}
                <TabNavigatior/>
                {this.renderTrendingDialog()}
            </View>
        );
    }
}
const pageSize = 15;
class TrendingTab extends Component{
    constructor(props) {
        super(props);
        const {tabLabel,timeSpan} = this.props;
        this.storeName = tabLabel;
        this.timeSpan = timeSpan;
    }
    componentDidMount(): void {
        this.loadData();
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE,(timeSpan)=>{
           this.timeSpan = timeSpan;
           this.loadData();
        });
    }
    componentWillUnmount(): void {
        if (this.timeSpanChangeListener){
            this.timeSpanChangeListener.remove();
        }
    }
    loadData(loadMore){
        const {onLoadTrendingData,onLoadMoreTrendingData}=this.props;
        const store=this._store();
        const url=this.genFetchUrl(this.storeName);
        if (loadMore){
            onLoadMoreTrendingData(this.storeName,++store.pageIndex,pageSize,store.items,favoriteDao,callback=>{
                this.refs.toast.show("没有更多");
            })
        }else {
            onLoadTrendingData(this.storeName,url,pageSize,favoriteDao);
        }
    }
    _store(){
        const {trending} = this.props;
        let store=trending[this.storeName];
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
        return URL + key +'?'+this.timeSpan.searchText;
    }
    renderItem(data){
        const  item =data.item;
        return <TrendingItem
            projectModel={item}
            onSelect={(callback)=>{
                NavigationUtil.goPage({
                    projectModel:item,
                    flag:FLAG_STORAGE.flag_trending,
                    callback,
                },'DetailPage')
            }}
            onFavorite={(item,isFavorite)=>FavoriteUtil.onFavorite(favoriteDao,item,isFavorite,FLAG_STORAGE.flag_trending)}

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

        const {trending} = this.props;
        let store=this._store();
        return(
            <View style={styles.container}>
                <FlatList data={store.projectModels}
                          renderItem={data=>this.renderItem(data)}
                          keyExtractor={item=>""+(item.item.id||item.item.fullName)}
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
    trending:state.trending,
});
const mapDispatchToProps= dispatch =>({
    onLoadTrendingData:(storeName,url,pageSize,favoriteDao)=>dispatch(actions.onLoadTrendingData(storeName,url,pageSize,favoriteDao)),
    onLoadMoreTrendingData:(storeName,pageInex,pageSize,items,favoriteDao,callBack)=>dispatch(actions.onLoadMoreTrendingData(storeName,pageInex,pageSize,items,favoriteDao,callBack)),
});
const TrendingTabPage=connect(mapStateToProps,mapDispatchToProps)(TrendingTab)

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
            minWidth:50,
        },
        indicatorStyle: {
            height:2,
            backgroundColor:'white',
        },
        labelStyle: {
            fontSize: 13,
            marginTop: 6,
            marginBottom:6
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
