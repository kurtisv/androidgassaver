import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { SearchBar } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Ionicons icon set

export default function App() {
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState('');
  const mapRef = useRef(null);

  const userlocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    const { latitude, longitude } = location.coords;
    const newLocation = {
      latitude,
      longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.01,
    };
    setLocation(newLocation);

    if (mapRef.current) {
      mapRef.current.animateToRegion(newLocation, 1000);
    }
  };

  useEffect(() => {
    userlocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 45.5017,
          longitude: -73.5673,
          latitudeDelta: 0.04,
          longitudeDelta: 0.01,
        }}
        region={location}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Vous êtes ici"
          />
        )}
      </MapView>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Rechercher..."
          onChangeText={(text) => setSearch(text)}
          value={search}
          lightTheme
        />
      </View>
      <View style={styles.ListButton}>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Liste')}>
          <Icon name="list" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={userlocation}>
          <Icon name="locate" size={35} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Trajectoire')}>
          <Icon name="map" size={35} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  ListButton: {
    position: 'absolute',
    bottom: 250,
    left: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },
  button: {
    backgroundColor: '#84bcff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 70,
    left: 10,
    right: 10,
    zIndex: 1, // Assurez-vous que la barre de recherche est au-dessus de la carte
  },
});
