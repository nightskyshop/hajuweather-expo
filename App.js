import * as Location from "expo-location"
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView , Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width:SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "aa7b6340b3980f25518fab2d46de7682";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning"

}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    console.log(latitude, longitude);
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0]?.region);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    console.log(json);
  }
  useEffect(() => {
    getWeather();
  }, [])
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView showsHorizontalScrollIndicator={false} pagingEnabled horizontal contentContainerStyle={styles.weather}>
        {
          days.length === 0 ? (
            <View style={{...styles.day, alignItems: "center"}}>
              <ActivityIndicator style={styles.loading} color="white" size="large" />
                  <Fontisto name={icons["Atmosphere"]} size={100} color="white" />
            </View>
          ) : (
            days.map((day, index) => 
              <View key={index} style={styles.day}>
                <View style={styles.weatherIcon}>
                  <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                  <Fontisto name={icons[day.weather[0].main]} size={100} color="white" />
                </View>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              </View>
            )
          )
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "white",
    fontSize: 50,
    fontWeight: "500",
  },
  day: {
    width: SCREEN_WIDTH,
  },
  weatherIcon: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  temp: {
    color: "white",
    marginTop: 50,
    marginLeft: 20,
    fontSize: 90,
  },
  description: {
    color: "white",
    marginTop: -10,
    marginLeft: 20,
    fontSize: 40,
  },
  loading: {
    marginTop: 20,
  },
  tinyText: {
    fonstSize: 20,
  }
});