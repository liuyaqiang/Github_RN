import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import WebViewPage from '../page/WebViewPage';
import AboutPage from "../page/about/AboutPage";
import AboutMePage from "../page/about/AboutMePage";

const InitNavigator=createStackNavigator(
    {
        WelcomePage:{
            screen:WelcomePage,
            navigationOptions:{
                header:null,
            },
        },
    },
);
const MainNavigator=createStackNavigator(
    {
        HomePage: {
            screen: HomePage,
            navigationOptions: {
                header: null,
            },
        },
        DetailPage: {
            screen: DetailPage,
            navigationOptions:{
                header:null,
            },
        },
        WebViewPage: {
            screen: WebViewPage,
            navigationOptions:{
                header:null,
            },
        },
        AboutPage: {
            screen: AboutPage,
            navigationOptions: {
                header: null,
            },
        },
        AboutMePage: {
            screen: AboutMePage,
             navigationOptions: {
                header: null,
            },
        },


    },
);
export default createAppContainer(createSwitchNavigator(
    {
        Init:InitNavigator,
        Main:MainNavigator,
    },{
        navigationOptions:{
            hearder:null,
        },
    },
))
