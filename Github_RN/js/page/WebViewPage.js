import React, {Component} from 'react';
import {DeviceInfo, StyleSheet, View} from 'react-native';
import {WebView}from 'react-native-webview';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import {TouchableOpacity} from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
type Props = {};

const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678'

export default class WebViewPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const {title, url} = this.params;
        this.state = {
            title: title,
            url: url,
            canGoBack: false,
        };
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    onBackPress() {
        this.onBack();
        return true;
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            NavigationUtil.goBack(this.props.navigation);
        }
    }
    renderRightButton(){
        return (
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={()=>this.onFavoriteButtonClick()}>
                    <FontAwesome
                        name={this.state.isFavorite?'star':'star-o'}
                        size={20}
                        style={{color:'white',marginRight:10}}
                    />
                </TouchableOpacity>
                {ViewUtil.getShareButton(()=>{

                })}
            </View>

        )
    }
    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        })
    }

    render(){
        const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight:30}:null;
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(()=>this.onBack())}
            title={this.state.title}
            titleLayoutStyle={titleLayoutStyle}
            style={{backgroundColor:THEME_COLOR}}
            rightButton={this.renderRightButton()}
        />;
        return(
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref = {webView=>this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e=>this.onNavigationStateChange(e)}
                    source={{uri:this.state.url}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
    },
});
