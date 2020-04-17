import React, {Component} from 'react';
import {StyleSheet,Text,View,Button,TextInput,AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action'
import {exp} from 'react-native-reanimated';
import DataStore from '../expand/dao/DataStore';

const KEY='save_key'

export default  class DataStoreDemoPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            showText:''
        }

        this.dataDtore = new DataStore();
    }
    loadData() {
        let url = `https://api.github.com/search/repositories?q=${this.value}`;
        this.dataDtore.fetchData(url)
            .then(data => {
                let showData = `初次数据加载时间：${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
                this.setState({
                    showText: showData
                })
            })
            .catch(error => {
                error && console.log(error.toString());
            })

    }

    render(){
        const {navigation}=this.props;
        return(
            <View style={styles.container}>
                <Text style={styles.welcome}>离线缓存框架设计</Text>
                <View style={styles.input_container}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text=>{
                            this.value = text;
                        }}
                    />
                </View>
                <Button
                    title={'获取'}
                    onPress={()=>{
                        this.loadData();
                    }}
                />
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

