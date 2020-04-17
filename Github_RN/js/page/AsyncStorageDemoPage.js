import React, {Component} from 'react';
import {StyleSheet,Text,View,Button,TextInput,AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action'
import {exp} from 'react-native-reanimated';

const KEY='save_key'

export default  class AysncStorageDemoPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            showText:''
        }
    }

    render(){
        const {navigation}=this.props;
        return(
            <View style={styles.container}>
                <Text style={styles.welcome}>AysncStorage 使用</Text>
                <View style={styles.input_container}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text=>{
                            this.value = text;
                        }}
                    />
                </View>
                <View style={styles.input_container}>
                    <Text onPress={()=>{
                     this.doSave();
                    }}>
                        存储
                    </Text>
                    <Text onPress={()=>{
                        this.doRemove();
                    }}>
                        删除
                    </Text>
                    <Text onPress={()=>{
                        this.getData();
                    }}>
                        获取
                    </Text>
                </View>
                <Text>
                    {this.state.showText}
                </Text>
            </View>
        );
    }
    doSave(){
        //用法一
        AsyncStorage.setItem(KEY,this.value,error => {
           error&&console.log(error.toString()) ;
        });
        // //用法二
        // AysncStorage.setItem(KEY,this.value)
        //     .catch(error=>{
        //         error&&console.log(error.toString()) ;
        //     })
        // //用法三
        // try{
        //     await AsyncStorage.setItem(KEY,this.value);
        // }catch (error) {
        //     error&&console.log(error.toString());
        // }
    }
    doRemove(){
        //用法一
        AsyncStorage.removeItem(KEY,error => {
            error && console.log(error.toString());
        });
        // //用法二
        // AsyncStorage.removeItem(KEY)
        //     .catch(error=>{
        //         error && console.log(error.toString());
        //     });
        // //用法三
        // try{
        //     await AsyncStorage.removeItem(KEY);
        // }catch (error) {
        //     error && console.log(error.toString());
        // }

    }
    getData(){
        //用法一
        AsyncStorage.getItem(KEY,(error,value)=>{
            this.setState({
                showText:value
            });
            console.log(value);
            error && console.log(error.toString());
        })
        // //用法二
        // AsyncStorage.getItem(KEY)
        //     .then(value=>{
        //         this.setState({
        //             showText:value
        //         });
        //         console.log(value);
        //     })
        //     .catch(error=>{
        //         error && console.log(error.toString());
        //     })
        // //用法三
        // try{
        //     const value = await  AsyncStorage.getItem(KEY);
        //     this.setState({
        //         showText:value
        //     });
        //     console.log(value);
        // }catch (error) {
        //     error && console.log(error.toString());
        //
        // }

    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5FCFF'
    },
    welcome:{
        fontSize:20,
        textAlign:'center',
        margin:10,
    },
    input:{
        height:30,
        flex: 1,
        borderColor:'black',
        borderWidth:1,
    },
    input_container:{
       flexDirection:'row',
       alignItems: 'center',
        justifyContent:'space-around'
    },
    }
)

