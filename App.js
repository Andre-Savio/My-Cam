import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera'


import { FontAwesome } from '@expo/vector-icons'

export default function App() {
  const camRef = useRef(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [hasPermission, setHasPermisssion] = useState(null)
  const [capturedPhoto, setCapturePhoto] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() =>{
    (async () =>{
      const { status } = await Camera.requestCameraPermissionsAsync ()
      setHasPermisssion(status === 'granted')
    })()
  }, [])

  if (hasPermission === null){
    return<View/>
  } if (hasPermission === false){
    return
    <Text>Acesso negado</Text>
  }

  async function takePicture(){
    if (camRef){
      const data = await camRef.current.takePictureAsync()
      setCapturePhoto(data.uri)
      setOpen(true)
    }
  }



  return (
    <SafeAreaView style={styles.container}>
      <Camera 
        style ={styles.camera}
        type={type}
        ref={camRef} >
          <View style={styles.contentButtons}>
            <TouchableOpacity style={styles.buttonFlip} onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
              )
            }}>
              <FontAwesome name={'exchange'} size={23} color={'red'}></FontAwesome>

            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
              <FontAwesome name={'camera'} size={23} color={'white'}></FontAwesome>
            </TouchableOpacity>
          </View>
      </Camera>
      {capturedPhoto &&( 
        <Modal
        animationType='slide'
        transparent={true}
        visible={open}>
          <View style={styles.contentModal}>
            <TouchableOpacity style={styles.closeButton} onPress={() =>{setOpen (false)}}>
              <FontAwesome name={'close'} size={50} color={'white'}></FontAwesome>

            </TouchableOpacity>
          
            <Image style={styles.imgPhoto} source={{ uri: capturedPhoto}}/>
          </View>
        </Modal>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera:{
    width:'100%',
    height:'100%'
  },
  contentButtons:{
    flex:1,
    backgroundColor:'transparent',
    flexDirection:'row',
  },
  buttonFlip:{
    position:'absolute',
    bottom:50,
    Left:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff',
    margin:20,
    height:50,
    width:50,
    borderRadius:20
  },
  buttonCamera:{
    position:'absolute',
    bottom:50,
    right:0,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'red',
    margin:20,
    height:50,
    width:50,
    borderRadius:20
  },
  contentModal:{
    flex:1,
    justifyContent:'center',
    alignItems:'flex-end',
    margin:20,

  },
  closeButton:{
    position:'absolute',
    top:10,
    left:2,
    margin:10,
  },
  imgPhoto:{
    width:'100%',
    height:400, 
  }
});
