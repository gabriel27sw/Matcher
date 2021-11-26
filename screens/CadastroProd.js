import React, {useState, useEffect} from "react";
import { StyleSheet, View, Image, Platform, ScrollView} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {Button} from "react-native-elements";
import {TextInput} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

import openDB from "../db";

const db = openDB();

const EMPTY_PRODUT = {
  ID_PESSOA: "",
  NOME: "",
  QUANT: 0,
  PRECO_ANT: 0.0,
  PRECO_ATU: 0.0,
  OBS: "",
  IMG_PROD: "",
};

function FormCadastro({onSaveCadastro}){
  const [produtos, setProdut] = useState({ ...EMPTY_PRODUT });  
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.principal}>    
      <View style={styles.secundaria}>
        <Image 
            style={styles.stretch}
            source={require('../img/logo.png')}
        />
      </View>
      <View style={styles.form}>
            <LinearGradient 
                    colors={['#FFF', "rgba(62, 170, 204, 1)"]}
                    start={{x: 0.0, y: 0.80}} end={{x: 0.0, y: 1.0}}
                    style={styles.gradientInput}
            >
            <TextInput
                mode="outlined"
                autoCapitalize="none"
                activeOutlineColor="rgba(62, 170, 204, 1)"
                theme={{ colors: { placeholder: "#ccc"} }}
                outlineColor="#FFF"
                underlineColor="#fff"
                style={styles.formInput}
                label="nome"
                onChangeText={nome => setProdut({ ...produtos, nome})}
            /></LinearGradient>
            <LinearGradient 
            colors={['#FFF', "rgba(62, 170, 204, 1)"]}
            start={{x: 0.0, y: 0.80}} end={{x: 0.0, y: 1.0}}
            style={styles.gradientInput}
            >
            <TextInput
                mode="outlined"
                autoCapitalize="none"
                activeOutlineColor="rgba(62, 170, 204, 1)"
                theme={{ colors: { placeholder: "#ccc"} }}
                outlineColor="#FFF"
                underlineColor="#fff"
                style={styles.formInput}
                label="qtd"
                onChangeText={quant => setProdut({ ...produtos, quant})}
            /></LinearGradient>
            <View style={styles.containerInput}>
                <LinearGradient 
                colors={['#FFF', "rgba(62, 170, 204, 1)"]}
                start={{x: 0.0, y: 0.80}} end={{x: 0.0, y: 1.0}}
                style={styles.gradientInput2}
                >
                <TextInput
                    mode="outlined"
                    activeOutlineColor="rgba(62, 170, 204, 1)"
                    autoCapitalize="none"
                    outlineColor="#FFF"
                    theme={{ colors: { placeholder: "#ccc"} }}
                    underlineColor="#fff"
                    style={styles.formInput2}
                    label="preço an."
                    onChangeText={preco_ant => setProdut({ ...produtos, preco_ant})}
                /></LinearGradient>
                <LinearGradient 
                colors={['#FFF', "rgba(62, 170, 204, 1)"]}
                start={{x: 0.0, y: 0.80}} end={{x: 0.0, y: 1.0}}
                style={styles.gradientInput2}
                >
                <TextInput
                    mode="outlined"
                    activeOutlineColor="rgba(62, 170, 204, 1)"
                    autoCapitalize="none"
                    outlineColor="#FFF"
                    theme={{ colors: { placeholder: "#ccc"} }}
                    underlineColor="#fff"
                    style={styles.formInput2}
                    label="preço at."
                    onChangeText={preco_atu => setProdut({ ...produtos, preco_atu})}
                /></LinearGradient>
            </View>
            <LinearGradient 
            colors={['#FFF', "rgba(62, 170, 204, 1)"]}
            start={{x: 0.0, y: 0.80}} end={{x: 0.0, y: 1.0}}
            style={styles.gradientInput}
            >
            <TextInput
                mode="outlined"
                activeOutlineColor="rgba(62, 170, 204, 1)"
                autoCapitalize="none"
                outlineColor="#FFF"
                theme={{ colors: { placeholder: "#ccc"} }}
                underlineColor="#fff"
                style={styles.formInput}
                label="inf. adicionais"
                onChangeText={obs => setProdut({ ...produtos, obs})}
            /></LinearGradient>
            <View style={styles.containerImage}>
                {image && <Image source={{ uri: image }} style={{ width: 70, height: 70 }} />}
            </View>
            <LinearGradient 
            colors={['#FFF', "rgba(62, 170, 204, 1)"]}
            start={{x: 0.0, y: 0.80}} end={{x: 0.0, y: 1.0}}
            style={styles.gradientInput}
            >
            <Button
                onPress={pickImage}
                title="selecione a foto"
                style={styles.formTextImage}
                titleStyle={{ color: 'rgba(62, 170, 204, 1)', fontSize:19 }} 
                buttonStyle={styles.formButtonImage}
            /></LinearGradient>
            <View style={styles.containerButton}>
                <Button title="cadastrar" titleStyle={{ color: 'white', fontSize:19 }}   onPress={() => navigation.navigate("Login")} buttonStyle={styles.buttonLogin}/>
            </View>
      </View>
    </View>
    );
}


export default function CadastroProduto({ navigation}) {
    const [produtos, setProdut] = useState({ ...EMPTY_PRODUT });  
    const [loading, setLoading] = useState(true);

    function saveProduto(produto) {
      db.transaction(tx => {
        tx.executeSql("INSERT INTO PRODUTOS (ID_PESSOA, NOME, QUANT, PRECO_ANT, PRECO_ATU, OBS, IMG_PROD) VALUES(?, ?, ?, ?, ?, ?, ?)", [produto.id_pessoa, produto.nome, produto.quant, produto.preco_ant, produto.preco_atu, produto.obs, produto.img_prod], (_, rs) => {
          console.log(`Novo usuario salvo: ${rs.insertId}`);
          recuperaProdutos();
        });
      });
    }
  
    function removeProduto(id) {
      db.transaction(tx => {
        tx.executeSql("DELETE FROM PRODUTOS WHERE ID_PRODUT = ?", [id], (_, rs) => {
          recuperaProdutos();
        });
      });
    }
  
    function recuperaProdutos() {
      db.transaction(tx => {
        tx.executeSql("SELECT * FROM PRODUTOS ORDER BY NOME ASC", [], (_, rs) => {
          setProdut(rs.rows._array);
          setLoading(false);
        });
      });
    }

    function buscaProdutos(id) {
      db.transaction(tx => {
        tx.executeSql("SELECT * FROM PRODUTOS WHERE ID_PRODUT = ?", [id], (_, rs) => {
          setProdut(rs.rows._array);
          setLoading(false);
        });
      });
    }
  
  
    useEffect(() => {
      recuperaProdutos();
    }, []);
  
    
  
  
    return (
    <View style={styles.principal}>  
      <FormCadastro onSaveCadastro={saveProduto} />  
      
    </View>
    );
    
    }
  
  const styles = StyleSheet.create({

    secundaria: {
      height: 310,
      alignItems: 'center',
      justifyContent:"center",
      backgroundColor: "rgba(62, 170, 204, 1)",
      padding: 14,
    },

    principal: {
        height: 500,
        flex: 1,
        backgroundColor: "#FFF",
        paddingBottom: 450,
    },
    stretch: {
        display: "flex",
        justifyContent: "center",
        marginTop:-50,
        zIndex:2
    },
    form: {
        backgroundColor: "#fff",
        borderRadius:20,
        marginBottom:40,
        marginLeft: 20,
        marginRight: 20,
        marginTop: -240,
        zIndex:100,
        height: 510,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems:"center",
        shadowColor: '#000000',
        elevation: 5
    },
    formInput: {
        backgroundColor: "#fff",
        width: 265,
        height: 50,
        fontSize:19,
        marginBottom: 1.5,
        zIndex:40,
    },
    gradientInput: {
        height: 59,
        borderBottomRightRadius: 5, 
        borderBottomLeftRadius: 5, 
        width: 266,
        paddingLeft:0.5,
        marginBottom: 10,
        
    },
    formInput2: {
        backgroundColor: "#fff",
        width: 120,
        height: 50,
        fontSize:19,
        marginBottom: 1.5,
        zIndex:40,
    },
    gradientInput2: {
        height: 59,
        borderBottomRightRadius: 5, 
        borderBottomLeftRadius: 5, 
        width: 121,
        paddingLeft:0.5,
        marginBottom: 0,
        
    },
    containerInput:{
        justifyContent: "space-between",
        flexDirection: "row",
        width: 260,
    },
    containerButton:{
        justifyContent: "center",
        flexDirection: "row",
        width: 260,
    },

    containerImage:{
        justifyContent: "center",
        flexDirection: "row",
        width: 260,
        marginTop: 20,
    },
    
    buttonLogin: {
        backgroundColor: "rgba(62, 170, 204, 1)",
        marginTop: 20,
        width:220,
        height:45,
        borderRadius:25,
        color: "#000",
        shadowColor: "#000"
    },

    formButtonImage: {
        backgroundColor: "#fff",
        width: 264.5,
        marginLeft:0.25,
        height: 58,
        fontSize:19,
        zIndex:40,
        
    },
  
  });

  
