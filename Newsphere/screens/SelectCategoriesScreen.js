import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { useUser } from '../database/UserContext';
import { Ionicons } from '@expo/vector-icons'

const CategoryCheckbox = ({ label, isSelected, onToggle }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && <View style={styles.checkboxCheckmark} />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function SelectCategoriesScreen({ navigation }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { userEmail } = useUser();

  const handleSelectedCategories = async () => {
    if (userEmail) {
        const userDocRef = doc(db, "users", userEmail);
        try {
            await updateDoc(userDocRef, {
                preferred_categories: selectedCategories,
            });
            console.log("Selected Categories Added");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }
    navigation.navigate('HomeTabs');
};

  const handleToggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
    console.log(selectedCategories)
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
        </View>
      <Text style={styles.header}>Pick your preferred categories</Text>
      <View style = {styles.lineStyle} />
      <FlatList
        data={["Technology", "Business", "Science", "Sports", "Health", "Politics"]}
        renderItem={({ item }) => (
          <CategoryCheckbox
            label={item}
            isSelected={selectedCategories.includes(item)}
            onToggle={() => handleToggleCategory(item)}
          />
        )}
        keyExtractor={(item) => item}
        numColumns={2}
        key={2} // Adding a key prop to force re-rendering if numColumns changes
        columnWrapperStyle={styles.row}
      />

      <TouchableOpacity style={styles.button} onPress={handleSelectedCategories} >
        <Text style={styles.buttonText}>Let's get started!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    width: '50%',
    paddingHorizontal: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: '#000',
  },
  checkboxCheckmark: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  lineStyle:{
    borderWidth: 0.2,
    borderColor:'#bbb',
    marginBottom:30,
  },
  row: {
    padding: 10
  }
});
