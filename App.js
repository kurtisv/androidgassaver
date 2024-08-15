import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Button, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { SearchBar } from '@rneui/themed';

export default function App() {
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState('');

  const userlocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.04, // Ajustement pour un zoom plus serré
      longitudeDelta: 0.01
    });
    
    console.log(location);
  };

  useEffect(() => {
    userlocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        region={location}
        onRegionChangeComplete={region => setLocation(region)}
      >
        {location && (
          <Marker 
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Vous êtes ici" 
            description="Position actuelle" 
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
        <Button title="Liste" onPress={() => console.log('Liste')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="user" onPress={userlocation} />
        <Button title="traject" onPress={() => console.log('Trajectoire')} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Pour rendre le fond du bouton un peu opaque
    borderRadius: 5,
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 5,
  },
  searchContainer: {
    position: 'absolute',
    top: 70,
    left: 10,
    right: 10,
    zIndex: 1, // Assurez-vous que la barre de recherche est au-dessus de la carte
  },
});
