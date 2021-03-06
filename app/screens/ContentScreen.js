import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Image,
  SafeAreaView, Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import CONFIG from '../config';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {TextShadow} from 'text-shadow-component';

const StarReview = ({rate}) => {
  let i;
  const starComponents = [];
  const fullStar = Math.floor(rate);
  const noStar = Math.floor(5 - rate);
  const halfStar = 5 - fullStar - noStar;

  for (i = 0; i < fullStar; i++) {
    starComponents.push(
      <Image
        key={`full-${i}`}
        source={require('../../assets/star_full.png')}
        resizeMode="cover"
        style={styles.star}
      />,
    );
  }

  for (i = 0; i < halfStar; i++) {
    starComponents.push(
      <Image
        key={`half-${i}`}
        source={require('../../assets/star_half.png')}
        resizeMode="cover"
        style={styles.star}
      />,
    );
  }

  for (i = 0; i < noStar; i++) {
    starComponents.push(
      <Image
        key={`empty-${i}`}
        source={require('../../assets/star_empty.png')}
        resizeMode="cover"
        style={styles.star}
      />,
    );
  }

  return (
    <View style={styles.starComponent}>
      {starComponents}
      <Text style={styles.starRating}>{rate}</Text>
    </View>
  );
};

export default function ContentScreen({route, navigation}) {
  const [images, setImages] = useState([]);
  const [content, setContent] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [shortLists, setShortLists] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const token = useSelector((state) => state.userReducer.authToken);
  const user = useSelector((state) => state.userReducer.user);

  const {contentId, type} = route.params;
  useEffect(() => {
    async function contentScreenOnLoad() {
      //assuming the following, the first axios call gets a list of ids
      //we then set urls for images??
      await axios
        .all([
          axios.get(`${CONFIG.API_URL}content/${contentId}`, {
            headers: {Authorization: `Bearer ${token}`},
          }),
          axios.get(`${CONFIG.API_URL}content/${contentId}/resource`, {
            headers: {Authorization: `Bearer ${token}`},
          }),
          axios.get(`${CONFIG.API_URL}User/${user.id}/Shortlist`, {
            headers: {Authorization: `Bearer ${token}`},
          }),
        ])
        .then(
          axios.spread((resContent, resImages, resShortList) => {
            setImages(resImages.data);
            setContent(resContent.data);
            setShortLists(resShortList.data);
          }),
        )
        .catch((res) => {
          console.log('why though? ' + res);
        })
        .finally(() => {
          setLoading(false);
        });
      // we'll just take the first element
    }
    contentScreenOnLoad();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addToList = (item) => {
    const newList = [{shortlistId: item.shortlistId, contentId: contentId}];
    // post list to server
    axios
      .post(`${CONFIG.API_URL}ShortlistContent`, newList, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then((res) => {
        //  console.log(res.data);s
        alert('Added to our list!');
      })
      .catch((res) => {
        if (res.response) {
          console.log(res.response.data.message);
          let msg = res.response.data.message;
          if (msg.includes('updating the entries')) {
            alert('That list already contains that item.');
          } else {
            alert('Error updating list.');
          }
        }
      })
      .finally(() => {});
    setModalVisible(!isModalVisible);
  };

  const Item = ({title}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      {/*TODO: some meaningful name here*/}
      {/*<Text style={styles.title}>Some Name here</Text>*/}
    </View>
  );

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => addToList(item)}>
      <Item title={item.listName} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => toggleModal()}>
            <View style={styles.card}>
              <FlatList
                data={shortLists}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.shortlistId}
              />
            </View>
          </Modal>
          <View style={styles.image}>
            <ImageBackground
              source={{
                uri: `${CONFIG.API_URL}resource/${content.coverImage.resourceId}`,
                headers: {Authorization: `Bearer ${token}`},
              }}
              style={styles.image}
              imageStyle={styles.imageStyle}>
              <TextShadow
                titleStyle={styles.name}
                title={content.name}
                textShadow={'2px 1px 0 #000000'}
              />
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  navigation.navigate('Home');
                }}>
                <Icon name="chevron-back" color="#fff" size={24} />
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <View style={styles.ratings}>
            <View style={styles.ratingRow}>
              <View>
                <Text style={styles.firstRatingText}>Social Rating</Text>
                <Text style={styles.ratingText}>Economic Rating</Text>
                <Text style={styles.ratingText}>Environmental Rating</Text>
              </View>
              <View style={styles.starRatingContent}>
                <StarReview rate={content.socialRating} />
                <StarReview rate={content.economicRating} />
                <StarReview rate={content.environmentalRating} />
              </View>

              <TouchableOpacity
                style={styles.collectButton}
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Icon name="heart" color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          </View>
          <SafeAreaView
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <FlatList
              style={styles.scrollView}
              data={images}
              keyExtractor={(item, index) => item.resourceId}
              extraData={{images}}
              horizontal={true}
              renderItem={({item}) => {
                return (
                  <View style={styles.swipeItem}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ImageViewer', {
                          imageId: item.resourceId,
                        });
                      }}>
                      <Image
                        style={styles.swipeImage}
                        source={{
                          uri: `${CONFIG.API_URL}resource/${item.resourceId}`,
                          headers: {Authorization: `Bearer ${token}`},
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </SafeAreaView>
          <View style={styles.descriptionHolder}>
            <Text style={styles.descriptionStyle}>{content.description}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 300,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  name: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  description: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 50 : 20,
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#388e3c',
  },
  collectButton: {
    position: 'absolute',
    right: 20,
    top: 5,
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#f44336',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 140,
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#f44336',
  },
  star: {
    width: 20,
    height: 20,
  },
  starComponent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starRating: {
    marginLeft: 5,
    color: '#666666',
  },
  ratings: {
    borderRadius: 15,
    margin: 20,
    paddingTop: 20,
    paddingBottom: 15,
    paddingLeft: 15,
    backgroundColor: '#fff',
  },
  ratingRow: {
    flexDirection: 'row',
  },
  firstRatingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ratingText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  starRatingContent: {
    marginLeft: 20,
  },
  card: {
    borderRadius: 30,
    height: 300,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  item: {
    borderRadius: 20,
    height: 50,
    marginTop: 20,
    marginHorizontal: 20,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    backgroundColor: '#4ba199',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 12,
    fontWeight: '500',
    color: '#fff',
  },
  scrollView: {
    paddingLeft: 5,
  },
  swipeItem: {
    marginLeft: 10,
  },
  swipeImage: {
    height: 100,
    width: 120,
    borderRadius: 5,
  },
  descriptionHolder: {
    margin: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  descriptionStyle: {
    padding: 20,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 25,
  },
});
