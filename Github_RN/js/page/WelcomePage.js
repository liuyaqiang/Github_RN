import React, {Component} from 'react';
import {StyleSheet,Text,View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';

export default class WelcomePage extends Component{
   componentDidMount(): void {
       this.timer=setTimeout(()=>{
            NavigationUtil.resetToHomePage(this.props);
       },2000);
   }
   componentWillMount(): void {
       this.timer&&clearTimeout(this.timer)
   }

    render(){
        return(
          <View style={styles.container}>
              <Text>
                  WelcomePage
              </Text>
          </View>
        );
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    }
    }
)
