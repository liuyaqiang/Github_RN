import React, {Component} from 'react';
import {StyleSheet,Text,View,Button,Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview';
import BaseItem from './BaseItem';

export default class TrendingItem extends BaseItem{
    render(){
        const {projectModel}=this.props;
        const {item} = projectModel;
        if (!item) return null;
        let favoriteButton =
            <TouchableOpacity
                style={{padding: 6}}
                underlayColor='transparent'
                onPress={() => this.onPressFavorite()}>
                <FontAwesome
                    name={this.state.isFavorite ? 'star' : 'star-o'}
                    size={26}
                    style={{color: '#678'}}
                />
            </TouchableOpacity>

        let description = '<p>' + item.description + '<p/>';
        return (
            <TouchableOpacity
                onPress={()=>this.onItemClick()}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>
                        {item.fullName}
                    </Text>
                    <HTMLView
                        value={description}
                        onLinkPress={(url)=>{

                        }}
                        stylesheet={{
                            p:styles.description,
                            a:styles.description,
                        }}
                    />
                    <Text sytle={styles.description}>
                        {item.mata}
                    </Text>
                    <View style={styles.row}>
                        <View  style={styles.row}>
                            <Text>Built by:</Text>
                                {item.contributors.map((result,i,arr)=>{
                                    if (i <2) {
                                        return <Image
                                            key={i}
                                            style={{height: 22, width: 22, margin: 2}}
                                            source={{uri: arr[i]}}
                                        ></Image>
                                    }
                                })}

                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text>Star:</Text>
                            <Text>{item.starCount}</Text>
                        </View>
                        {favoriteButton}
                    </View>
                </View>

            </TouchableOpacity>

        );
    }
}
const styles=StyleSheet.create({
    cell_container:{
      backgroundColor:'white',
      padding:10,
      marginLeft:5,
      marginRight:5,
      marginVertical:3,
      borderColor:'#dddddd',
      borderWidth:0.5,
      borderRadius:2,
      shadowColor:'gray',
      shadowOffset:{width:0.5,height:0.4},
      shadowOpacity:0.4,
      shadowRadius:1,
      elevation:2,
    },
    row:{
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
    },
    title:{
        fontSize:16,
        marginBottom:2,
        color:'#212121',
    },
    description:{
        fontSize:14,
        marginBottom:2,
        color:'#757575',
    }
});
