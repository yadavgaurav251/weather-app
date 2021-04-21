import React from 'react';
import { ActivityIndicator,StatusBar, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import SearchInput from './components/SearchInput';

import getImageForWeather from './utils/getImageForWeather'
import { fetchLocationId, fetchWeather } from './utils/api';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      location: '',
      loading: false,
      error: false,
      temperature: 0,
      weather: '',
    };
  }

  componentDidMount() {
    this.handleUpdateLocation('Goa');
  }

  handleUpdateLocation = city => {
    if (!city)
      return;

    this.setState({ loading: true }, async () => {
      try {
        const locationId = await fetchLocationId(city);
        const { location, weather, temperature } = await fetchWeather(locationId);

        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature,
        });

      } catch (e) {
        this.setState({
          loading: false,
          error: true,
        });
      }
    });

  };

  render() {
    const { loading, error, location, weather, temperature } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="height">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />
            {!loading && (
              <View>
                {
                  error && (
                    <Text style={[styles.smallText, styles.textStyle]}>
                      Could not load weather , please try another city
                    </Text>
                  )}
                {
                  !error && (
                    <View>
                      <Text style={[styles.largeText, styles.textStyle]}> {location}</Text>
                      <Text style={[styles.smallText, styles.textStyle]}> {weather}</Text>
                      <Text style={[styles.largeText, styles.textStyle]}> {`${Math.round(temperature)}°`}</Text>
                    </View>
                  )
                }


                <SearchInput placeholder="Search any city" onSubmit={this.handleUpdateLocation} />
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },

  textStyle: {
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
});
