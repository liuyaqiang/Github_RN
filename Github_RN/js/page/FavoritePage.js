import React, {Component} from 'react';
import {FlatList,ActivityIndicator,Button,StyleSheet,Text,View,RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import  actions from '../action/index';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import FetchDemoPage from './FetchDemoPage';
import {onLoadPupularData} from '../action/popluar';
import {onLoadFavotire} from '../action/favorite';
import PopularItem from '../common/PopularItem';
import TrendingItem from '../common/TrendingItem';

import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import {DeviceInfo} from 'react-native';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';

const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
export default class Favorite extends Component {
    constructor(props) {
        super(props);
        this.tabNames=['最热','趋势'];

    }
    render(){
        let statusBar = {
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        };
        let navigationBar = <NavigationBar
            title={'收藏'}
            statusBar={statusBar}
            style={{backgroundColor:THEME_COLOR}}
        />;
        const TabNavigator=createAppContainer(createMaterialTopTabNavigator({
                'Popular': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
                    navigationOptions: {
                        title: '最热',
                    },
                },
                'Trending': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
                    navigationOptions: {
                        title: '趋势',
                    },
                },
            },
            {
                tabBarOptions:{
                    tabStyle:styles.tabStyle,
                    upperCaseLabel:false,
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
class FavoriteTab extends Component{
    constructor(props) {
        super(props);
        const {flag} = this.props;
        this.storeName = flag;
    }
    componentDidMount(): void {
        this.loadData();
    }
    loadData(isShowLoading){
        const {onLoadFavoriteData}=this.props;
        onLoadFavoriteData(this.storeName,isShowLoading);
    }
    _store(){
        const {favorite} = this.props;
        let store= favorite[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
            }
        }
        return store;
    }

    renderItem(data) {
        const {theme} = this.props;
        const item = data.item;
        const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
        return <Item
            theme={theme}
            projectModel={item}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    theme,
                    projectModel: item,
                    flag: this.storeName,
                    callback,
                }, 'DetailPage');
            }}
            onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
        />;
    }

    render() {
        let store = this._store();
        const {theme} = this.props;
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => '' + (item.item.id || item.item.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(true)}
                            tintColor={THEME_COLOR}
                        />
                    }
                />
                <Toast ref={'toast'}
                       position={'center'}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    favorite: state.favorite,
});

const mapDispatchToProps = dispatch => ({
    onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
});

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);

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
