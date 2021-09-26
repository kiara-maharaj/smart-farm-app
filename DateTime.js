import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment-timezone";

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursaday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec']

const WeatherItem = ({title, value, unit}) => {
    return(
        <View style={styles.weatherItem}>
            <Text style={styles.weatherItemTitle}>{title}</Text>
            <Text style={styles.weatherItemTitle}>{value}{unit}</Text>
        </View>
    )
}

const DateTime = ({current, lat, lon, timeZone}) => {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    useEffect (() => {
        setInterval(() => {
            const time = new Date();
            const month = time.getMonth();
            const date = time.getDate();
            const day = time.getDay();
            const hour = time.getHours();
            const hoursIn12HourFormat = hour >= 13 ? hour %12: hour
            const minutes = time.getMinutes();
            const ampm = hour >=12 ? 'pm' : 'am'

            setTime((hoursIn12HourFormat < 10? '0'
            +hoursIn12HourFormat : hoursIn12HourFormat) + ':' + (minutes < 10?
            '0' + minutes: minutes) + ' ' + ampm)

            setDate(days[day] + ', '+date+ ' ' + months[month])
        }, 1000);
    }, [])
    return (
        <View style={styles.container}> 
            <View>
                <View>
                    <Text style={styles.heading}>{time}</Text>
                </View>
                <View>
                    <Text styles={styles.subheading}>{date}</Text>
                </View>
                <View style={styles.weatherItemContainer}>
                    <WeatherItem title="Humidity" value={current? current.humidity : ""} unit="%"/>
                    <WeatherItem title="Pressure" value={current? current.pressure: ""} unit="hPA"/>
                    <WeatherItem title="Sunrise" value={current? moment.tz(current.sunrise,timeZone).format('HH:mm'): ""} unit="am"/>
                    <WeatherItem title="Sunset" value={current? moment.tz(current.sunset,timeZone).format('HH:mm'): ""} unit="pm"/>
                </View>
            </View> 
            <View style={styles.rightAlign}>
                <Text style={styles.timeZone}>{timeZone}</Text>
                <Text style={styles.latlong}>{lat}N {lon}E</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:2,
        flexDirection:"row",
        justifyContent:'space-between',
        padding: 15
    },
    heading: {
        fontSize: 35,
        color: 'black',
        fontWeight: '100',
        marginLeft: 5
    },
    subheading: {
        fontSize: 25,
        color: '#000000',
        fontWeight: '300'
    },
    rightAlign:{
        textAlign:'right',
        marginTop: 10
    },
    timeZone:{
        fontSize:20,
        color:'black'
    },
    latlong:{
        fontSize:16,
        color:'black',
        fontWeight:'700'
    },
    weatherItemContainer: {
        backgroundColor: "#18181b99",
        borderRadius: 10,
        padding: 10,
        marginTop: 10
    },
    weatherItem: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    weatherItemTitle: {
        color: "#eee",
        fontSize: 14,
        fontWeight: '100'
    },
})

export default DateTime