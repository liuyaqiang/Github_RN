import React, {Component} from 'react';
import {StyleSheet,Text,View,Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action'
import {exp} from 'react-native-reanimated';

class FavoritePage extends Component {
    render(){
        const {navigation}=this.props;
        return(
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    TrendingPage
                </Text>
                <Button
                    title={'修改主题'}
                    onPress={()=>this.props.onThemeChange('red')}
                />

            </View>
        );
    }
}

const styles=StyleSheet.create({
        container:{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
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
export default connect(null,mapDispatchToProprs)(FavoritePage);
