import React from 'react'
import {View, ScrollView, Text, Image, StyleSheet} from 'react-native'
import FutureForecast from './FutureForecast'
import moment from 'moment-timezone'

const WeatherScroll = ({weatherData}) => {
    return (
        <ScrollView horizontal={true} style={styles.scrollView}>
            <CurrentTempE1 data={weatherData && weatherData.length> 0 ? weatherData[0] : {}}/>
            <FutureForecast data={weatherData}/>
        </ScrollView>
    )
}

const CurrentTempE1 = ({data}) => {

    if (data && data.weather){
        const img = {uri: 'http://openweathermap.org/img/wn/'+ data.weather[0].icon +'@4x.png'}
        return(
            <View style={styles.CurrentTempContainer}>
                <Image source={img} style={styles.image}/>
                <View style={styles.otherContainer}>
                    <Text style={styles.day}>{moment(data.dt*1000).format('dddd')}</Text>
                    <Text style={styles.temp}>Night - {data.temp.night}&#176;C</Text>
                    <Text style={styles.temp}>Day - {data.temp.day}&#176;C</Text>
                </View>
            </View>
        )
        
    } else{
        return(
            <View>

            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 0.4,
        backgroundColor: '#18181bcc',
        padding: 30,
    },
    image: {
        width: 150,
        height: 150
    },
    CurrentTempContainer: {
        flexDirection: 'row',
        backgroundColor: '#00000033',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#eee',
        borderWidth: 1,
        padding: 15
    },
    day: {
        fontSize: 20,
        color: 'white',
        backgroundColor: '#3c3c44',
        padding: 10,
        textAlign: 'center',
        borderRadius: 50,
        fontWeight: '200',
        marginBottom: 15
    },
    temp:{
        fontSize: 16,
        color: 'white',
        fontWeight: '100',
        textAlign: 'center'
    },
    otherContainer: {
        paddingRight: 40
    }
})

export default WeatherScroll