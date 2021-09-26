import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, Button} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import DateTime from './components/DateTime';
import WeatherScroll from './components/WeatherScroll';
import Task from './components/Task';

import { ScrollView, TextInput } from 'react-native-gesture-handler';

const img = require('./assets/image.png')
const API_KEY = '174ff50f5545fdee879c79c1789b0d40';//my openweather onecall api key

function HomeScreen(){
  const [data, setData] = useState({})

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        fetchDataFromApi("40.7128","-74.0060") //if location access denied, display default location of New York
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchDataFromApi(location.coords.latitude, location.coords.longitude);
    })();
  }, [])

  const fetchDataFromApi = (latitude, longitude) => {
    if (latitude && longitude) {
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

      //console.log(data)
      setData(data)
      })

    }

  }

  return (
    <View style={styles.container}>
      <ImageBackground source={img} style={styles.image}>
        <Text style={styles.heading}>Welcome, Farmer</Text>
        <DateTime current={data.current} timezone={data.timezone} lat={data.lat} lon={data.lon}/>
         <WeatherScroll weatherData={data.daily}/>
      </ImageBackground>
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //flexDirection: 'column'
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  heading: {
    color: '#43A800',
    fontSize: 50,
    fontFamily: 'sans-serif',
    marginHorizontal: 15,
    fontStyle: 'normal',
    fontWeight: '200',
    letterSpacing: 1,
    fontVariant: ['small-caps'],
  },
  button: {
    backgroundColor: "#6B8E23",
    padding: 30,
    borderRadius: 10,
    marginTop: 100
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  tasksWrapper:{
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontVariant: ['small-caps'],
    marginHorizontal: 15
  },
  items: {
    marginTop: 30
  },
  writeTaskWrapper:{
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input:{
    paddingVertical: 15,
    width: 250,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1
  },
  addWrapper:{
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1
  },
  addText:{},
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
});

function GalleryScreen() {
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
    <View>
      <Text style={styles.heading}>Gallery</Text>
      <Text style={styles.sectionTitle}>Upload progress pictures of your farm here</Text>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Pick an image from camera roll</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    </View>
  );
}//end GalleryScreen

function InventoryScreen(){
  const [crop, setCrop] = useState();
  const [cropItems, setCropItems] = useState([]);

  const handleAddCrop = () => {
    Keyboard.dismiss();
    setCropItems([...cropItems,crop])
    setCrop(null);
  }

  const completeCrop = (index) => {
    let cropItemsCopy = [...cropItems];
    cropItemsCopy.splice(index, 1);
    setCropItems(cropItemsCopy)
  }

  return(
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        KeyboardShouldPersistTaps='handled'
      >
      <View style={styles.tasksWrapper}>
        <Text style={styles.heading}>Crops</Text>
        <Text style={styles.sectionTitle}>List of all the crops and quantity</Text>
        <View style={styles.items}>
          {
            cropItems.map((crop, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => completeCrop(index)}>
                  <Task text={crop} />
                </TouchableOpacity>
              )
            })
          }
        </View>

      </View>
      </ScrollView>

      {/*Add a new crop*/}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Add a new crop'} value={crop} onChangeText={text => setCrop(text)}/>

        <TouchableOpacity onPress={() => handleAddCrop()} >
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>

    </View>
  );
}

function TasksScreen(){
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems,task])
    setTask(null);
  }

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }

  return(
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        KeyboardShouldPersistTaps='handled'
      >
        {/*Today's Tasks*/}
      <View style={styles.tasksWrapper}>
        <Text style={styles.heading}>Tasks</Text>
        <Text style={styles.sectionTitle}>List of tasks to do</Text>
        <View style={styles.items}>
          {
            taskItems.map((item, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                  <Task text={item} />
                </TouchableOpacity>
              )
            })
          }
        </View>

      </View>
      </ScrollView>

      {/*Write a task*/}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)}/>

        <TouchableOpacity onPress={() => handleAddTask()} >
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>

    </View>
  );
}

const Tab = createBottomTabNavigator();

function App(){
  return(
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image source={require("./assets/home.png")}
              style={{width: 25, height: 25}}/>
            </View>
          )//close tabBarIcon
        }}/>
        <Tab.Screen name="Inventory" component={InventoryScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image source={require("./assets/inventory.png")}
              style={{width:25, height: 25}}/>
            </View>
          )
        }}/>
        <Tab.Screen name="Tasks" component={TasksScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image source={require("./assets/tasks.png")}
              style={{width: 25, height: 25}}/>
            </View>
          )
        }}/>
        <Tab.Screen name="Gallery" component={GalleryScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image source={require("./assets/gallery.png")}
              style={{width: 25, height: 25}}/>
            </View>
          )
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App;
