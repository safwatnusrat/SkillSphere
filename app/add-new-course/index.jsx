import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './../../lib/firebase'
import Category from '../../components/Home/Category';
import * as ImagePicker from 'expo-image-picker';
import { ToastAndroid } from 'react-native';

const index = () => {
  const [formData, setFormData] = useState({});
  const [level, setLevel] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [images,setImages]=useState();

  useEffect(() => {
    getCategories();
  }, [])
  const getCategories = async () => {
    setCategoryList([]);
    const snapshot = await getDocs(collection(db, 'category'));
    snapshot.forEach((doc) => {
      console.log(doc.data());
      setCategoryList(categoryList => [...categoryList, doc.data()])
    })
  }
  const imagePicker=async()=>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect:[4,3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets[0].uri)
    } else {
      alert('You did not select any image.');
    }

  }

  const handleInputChange = (fieldName, fieldvalue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldvalue

    }))
  }
  const onSubmit=()=>{
    if(Object.keys(formData).length!=5){
      ToastAndroid.show("Fill all the fields",ToastAndroid.SHORT)
      return ;
    }
  }
  return (
    <ScrollView style={{
      padding: 20
    }}>
      <Text style={{
        fontFamily: 'outfit-medium',
        fontSize: 20
      }}>Add New Course</Text>
     <Pressable onPress={imagePicker}>
  {!images ? (
    <Image
      source={require('./../../assets/images/addimage.jpg')}
      style={{
        width: 100,
        height: 100,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#808080',
      }}
    />
  ) : (
    <Image
      source={{ uri: images }}
      style={{
        width: 100,
        height: 100,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#808080',
      }}
    />
  )}
</Pressable>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Course Name *</Text>
        <TextInput style={styles.input}
          onChangeText={(value) => handleInputChange('name', value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Level *</Text>

        <Picker
          selectedValue={selectedCategory}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedCategory(itemValue);
            handleInputChange('Level', itemValue);
          }
          }>
          <Picker.Item label="Select Level" value="" /> 
          <Picker.Item label="Beginner" value="beginner" />
          <Picker.Item label="Intermediate" value="intermediate" />
          <Picker.Item label="Advanced" value="advanced" />

        </Picker>

      </View>
      {/* <View style={styles.inputContainer}>
        <Text style={styles.label}>Category *</Text>
        <TextInput style={styles.input}
          onChangeText={(value) => handleInputChange('category', value)} />
      </View> */}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category *</Text>

        <Picker
          selectedValue={level}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => {
            setLevel(itemValue);
            handleInputChange('Category', itemValue);
          }
          }>
          <Picker.Item label="Select Category" value="" /> 
          {categoryList.map((Category, index) => (
            <Picker.Item key={index} label={Category.name} value={Category.name} />
          ))}


        </Picker>

      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Duration *</Text>
        <TextInput style={styles.input}
          onChangeText={(value) => handleInputChange('duration', value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>About *</Text>
        <TextInput style={[styles.input, { minHeight: 120, textAlignVertical: 'top' }]}
          numberOfLines={5}
          multiline={true}
          onChangeText={(value) => handleInputChange('about', value)} />
      </View>

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={{
          fontFamily: 'outfit-medium',
          textAlign: 'center'
        }}> Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 5
  },
  input: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    fontFamily: 'outfit-regular'
  },
  label: {
    marginVertical: 5,
    fontFamily: 'outfit-regular'
  },
  button: {
    padding: 15,
    backgroundColor: '#e2bc4d',
    borderRadius: 7,
    marginVertical: 50,
    marginBottom:50
  }
})

export default index
