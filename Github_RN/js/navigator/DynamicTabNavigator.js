import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator,BottomTabBar} from 'react-navigation-tabs';
import {DeviceInfo} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import {connect} from 'react-redux';
import EventBus from 'react-native-event-bus'
import EventTypes from "../util/EventTypes";
const TABS= {
    PopularPage:{
        screen:PopularPage,
            navigationOptions:{
            tabBarLabel:'最热',
                tabBarIcon:({tintColor,focused})=>(
                <MaterialIcons
                    name={'whatshot'}
                    size={25}
                    style={{color:tintColor}}
                />
            )
        }
    },
    TrendingPage:{
        screen:TrendingPage,
            navigationOptions:{
            tabBarLabel:'趋势',
                tabBarIcon:({tintColor,focused})=>(
                <Ionicons
                    name={'md-trending-up'}
                    size={25}
                    style={{color:tintColor}}
                />
            )
        }
    },
    FavoritePage:{
        screen:FavoritePage,
            navigationOptions:{
            tabBarLabel:'收藏',
                tabBarIcon:({tintColor,focused})=>(
                <MaterialIcons
                    name={'favorite'}
                    size={25}
                    style={{color:tintColor}}
                />
            )
        }
    },
    MyPage:{
        screen:MyPage,
            navigationOptions:{
            tabBarLabel:'我的',
                tabBarIcon:({tintColor,focused})=>(
                <Entypo
                    name={'user'}
                    size={25}
                    style={{color:tintColor}}
                />
            )
        }
    }
};

class DynamicTabNavigator extends React.Component{
        constructor(props) {
            super(props);
            console.disableYellowBox=true;
        }
        _tabNavigator(){
            if (this.Tabs){
                return  this.Tabs;
            }
            const {PopularPage,TrendingPage,FavoritePage,MyPage}=TABS;
            const tabs={PopularPage,TrendingPage,FavoritePage,MyPage};
            PopularPage.navigationOptions.tabBarLabel='最热';
            return this.Tabs=createAppContainer(createBottomTabNavigator(
                    tabs,
                    {
                        tabBarComponent:props=>{
                            return <TabBarComponent theme={this.props.theme}{...props}/>;
                        },
                     }
                ));
        }
        render(){
            const Tab=this._tabNavigator();
            return <Tab
                onNavigationStateChange = {(prevState,newState,action) =>{
                    EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select,{
                        from:prevState.index,
                        to:newState.index
                    })
                }
                }
            >

            </Tab>;
        }
}

class TabBarComponent extends React.Component{
    render(){
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.props.theme}
        />;
    }
}

const  mapStateTopProps=state=>({
    theme:state.theme.theme
});
export default connect(mapStateTopProps)(DynamicTabNavigator);
