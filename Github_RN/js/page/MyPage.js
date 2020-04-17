import React, {Component} from 'react';
import {StyleSheet,Text,View,Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action'
import {exp} from 'react-native-reanimated';
import NavigationUtil from '../navigator/NavigationUtil';
import NavigationBar from '../common/NavigationBar';

const THEME_COLOR = '#678';
class MyPage extends Component {
    render(){
        let statusBar = {
            backgroundColor:THEME_COLOR,
            barStyle:'light-content',
        };
        let navigationBar = <NavigationBar
            title={'我的'}
            statusBar={statusBar}
            style={{backgroundColor:THEME_COLOR,marginTop:30}}
        />;
        const {navigation}=this.props;
        return(
            <View style={styles.container}>
                {navigationBar}
                <Text style={styles.welcome}
                      onPress={()=>{
                          NavigationUtil.goPage({navigation: this.props.navigation},'DetailPage')
                      }
                      }>跳转详情页</Text>
                <Button
                    title={'Fetch使用'}
                    onPress={()=>{
                        NavigationUtil.goPage({navigation: this.props.navigation},'FetchDemoPage')
                    }
                    }/>
                <Button
                    title={'AysncStorage使用'}
                    onPress={()=>{
                        NavigationUtil.goPage({navigation: this.props.navigation},'AysncStorageDemoPage')
                    }
                    }/>
                <Button
                    title={'DataStore使用'}
                    onPress={()=>{
                        NavigationUtil.goPage({navigation: this.props.navigation},'DataStoreDemoPage')
                    }
                    }/>
            </View>
        );
    }
}

const styles=StyleSheet.create({
        container:{
            flex:1,
            // justifyContent:'center',
            // alignItems:'center',
            backgroundColor:'#F5FCFF'
        },
        welcome:{
            fontSize:20,
            textAlign:'center',
            margin:10,
        }
    }
)
const mapDispatchToProprs=dispatch=>(
    {
        onThemeChange: theme=>dispatch(actions.onThemeChange(theme))
    }
);
export default connect(null,mapDispatchToProprs)(MyPage);
