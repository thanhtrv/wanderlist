import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Title, Caption, Drawer} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {setUser, setToken, setExpiry, setIsAuth} from '../actions/user';
import AsyncStorage from '@react-native-community/async-storage';

export function SidebarScreen(props) {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View>
          <View style={styles.profile}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.profileAvatar}
            />
            <View>
              <Title style={styles.profileTitle}>Team TBA</Title>
              <Caption style={styles.profileCaption}>@TBA</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section>
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="home" color={color} size={size} />
            )}
            label="Home"
            onPress={() => {
              props.navigation.navigate('Home');
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="map" color={color} size={size} />
            )}
            label="Map"
            onPress={() => {
              props.navigation.navigate('Map');
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="pricetags" color={color} size={size} />
            )}
            label="Rewards"
            onPress={() => {
              props.navigation.navigate('Rewards');
            }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="log-out" color={color} size={size} />
          )}
          label="Log Out"
          onPress={async () => {
            //clear Async storage
            await AsyncStorage.setItem(
              'persistentAuth',
              JSON.stringify({
                authToken: '',
                expiry: '',
                user: null,
              }),
            );
            dispatch(setUser(null));
            dispatch(setExpiry(''));
            dispatch(setToken(''));
            dispatch(setIsAuth(false));
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    flexDirection: 'row',
    marginTop: 20,
  },
  profileAvatar: {
    width: 100,
    height: 100,
  },
  profileTitle: {
    fontSize: 20,
    marginTop: 15,
    fontWeight: 'bold',
  },
  profileCaption: {
    fontSize: 16,
    lineHeight: 16,
  },
  bottomSection: {
    marginBottom: 20,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
});
