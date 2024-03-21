import React, { Component } from 'react';
import { petEventEmitter } from '../pages/EventEmitter';
import { saveHappiness, loadHappiness } from './happinessStorage';
import { saveHunger, loadHunger } from './hungerStorage';
import { View, StyleSheet, Text, Image, TouchableOpacity, } from 'react-native';
import { Ionicons, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

class Pet extends Component {
  constructor(props) {
    super(props);
    // Pet animations, when the new pet stages are drawn, set the index below on the render function
    
    this.state = {
      frogimages: [
        require('./PetImages/FrogImages/animatedFrog.gif'),
        require('./PetImages/FrogImages/animatedFrog(sad).gif'),
        require('./PetImages/FrogImages/animatedFrog(happy).gif'),
        require('./PetImages/FrogImages/animatedFrog(happy).gif'),
        require('./PetImages/FrogImages/animatedFrog(dead).gif'),
        require('./babyfrog.png'),
        require('./youngfrog.png'),
      ],
      // All Dog and Cat related are currently placeholders for new pets
      dogimages: [
        require('./PetImages/DogImages/animatedDog.png'),
        require('./PetImages/DogImages/animatedDog(sad).gif'),
        require('./PetImages/DogImages/animatedDog(happy).gif'),
        require('./PetImages/DogImages/animatedDog(happy)1.gif'),
        require('./PetImages/DogImages/animatedDog(dead).gif'),
      ],
      // Placeholder for new pet
      catimages: [
        require('./PetImages/CatImages/animatedCat.png'),
        require('./PetImages/CatImages/animatedCat(sad).gif'),
        require('./PetImages/CatImages/animatedCat(happy).gif'),
        require('./PetImages/CatImages/animatedCat(happy)1.gif'),
        require('./PetImages/CatImages/animatedCat(dead).gif'),
      ], 
      bunnyimages: [
        require('./PetImages/BunnyImages/animatedBunny.png'), // Has to be changed to gif
        require('./PetImages/CatImages/animatedCat(sad).gif'), // <--- Have to be changed to bunny images
        require('./PetImages/CatImages/animatedCat(happy).gif'), // <---
        require('./PetImages/CatImages/animatedCat(happy)1.gif'), // <---
        require('./PetImages/CatImages/animatedCat(dead).gif'), // <---
      ], 
      penguinimages: [
        require('./PetImages/PenguinImages/animatedPenguin.png'), // Has to be changed to gif
        require('./PetImages/CatImages/animatedCat(sad).gif'), // <--- Have to be changed to Penguin images
        require('./PetImages/CatImages/animatedCat(happy).gif'), // <---
        require('./PetImages/CatImages/animatedCat(happy)1.gif'), // <---
        require('./PetImages/CatImages/animatedCat(dead).gif'), // <---
      ], 
      pigimages: [
        require('./PetImages/PigImages/animatedPig.png'), // Has to be changed to gif
        require('./PetImages/CatImages/animatedCat(sad).gif'), // <--- Have to be changed to pig images
        require('./PetImages/CatImages/animatedCat(happy).gif'), // <---
        require('./PetImages/CatImages/animatedCat(happy)1.gif'), // <---
        require('./PetImages/CatImages/animatedCat(dead).gif'), // <---
      ], 
      bearimages: [
        require('./PetImages/BearImages/animatedBear.png'), // Has to be changed to gif
        require('./PetImages/CatImages/animatedCat(sad).gif'), // <--- Have to be changed to bear images
        require('./PetImages/CatImages/animatedCat(happy).gif'), // <---
        require('./PetImages/CatImages/animatedCat(happy)1.gif'), // <---
        require('./PetImages/CatImages/animatedCat(dead).gif'), // <---
      ], 
      // More pets can be added here
      currentImageIndex: 0,
      name: 'Firulai',
      growthlvl: 0, // growth level in which stages are based on
      hunger: 0,
      happiness: 100,
      lastInteractionTime: new Date(),
      careMistakes: 0,
      pettype: 'frog',
      images: [],
      startDate: new Date("2024-03-16"), //Date the pet was created,  we need to get the info from pet creation
      examDate: new Date("2024-03-18") // Date the exam is due , we need to get the info from pet creation, please implement this
      
    };
  }

  // Choose images depending on the pet type
  updateImages = () => {
    console.log(this.state.pettype);
    switch (this.state.pettype) {
      case 'frog':
        images = this.state.frogimages;
        break;
      case 'dog':
        images = this.state.dogimages;
        break;
      case 'cat':
        images = this.state.catimages;
        break;
      case 'bunny':
        images = this.state.bunnyimages;
        break;
      case 'penguin':
        images = this.state.penguinimages;
        break;
      case 'pig':
        images = this.state.pigimages;
        break;
      case 'bear':
        images = this.state.bearimages;
        break;
      // More pets can be added here
    };
  
    this.setState({ images });
  }


  componentDidMount() {
    this.loadHappinessFromStorage();
    this.loadHungerFromStorage(); 

    // Simulate happiness increasing over time
    const interval = setInterval(() => {
      if (this.state.happiness < 100) {
        this.setState((prevState) => ({
          happiness: prevState.happiness + 10,
        }), () => {
          this.saveHappinessToStorage();
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    // Receives event from Mypets.js when a new pet is created
    // Eventually this would need to be changed to function with choosing an existent pet data
    petEventEmitter.on("petType", (type) => {
      this.setState({ pettype: type }, () => {
        this.updateImages();
        console.log("Type of pet received", type);
      });
    });

    // If user hasn't choose a pet type, set images to default (frog)
    if (this.state.images.length <= 0) {
      this.setState((prevState) => ({
        images: this.state.frogimages,
      }));
    }
    
    this.setState((prevState) => {
      // Initialize an object to hold the state update
      let updates = {};
    
      // Check if careMistakes are >= 10
      if (prevState.careMistakes >= 10) {
        // Emit event petDeath. This is for the "Homepage.js" file to receive it
        petEventEmitter.emit('petDeath', true);
        
        // Update currentImageIndex to the last image
        updates = { currentImageIndex: prevState.images.length - 1 };
      } else {
        // If careMistakes are less than 10, emit petAlive
        petEventEmitter.emit('petAlive', true);
      }
    
      // Return the updates to be applied to the state
      return updates;
    });

    // Check for care mistakes every 15 minutes
    const careMistakeInterval = setInterval(() => {
      const currentTime = new Date();
      const lastInteractionTime = new Date(this.state.lastInteractionTime);
      const timeDifference = (currentTime - lastInteractionTime) / (1000 * 60); // in minutes

      if (timeDifference >= 15 && (this.state.happiness === 0 || this.state.hunger === 100)) {
        this.setState((prevState) => ({
          careMistakes: prevState.careMistakes + 1,
        }));
      }
    }, 1000 * 60 * 15);
    
    handleClick = () => {
      this.props.onChange(true);
      console.log("Goodbye Click");
    }

    const goodbyeInterval = setInterval(() => {
      const { examDate, startDate } = this.state;
      if (examDate >= new Date()){
        this.props.onChange(true)
      }
    })

    const growthInterval = setInterval(() => {
      const { examDate, startDate } = this.state;
      const timeToExam = Math.ceil((examDate - startDate) / (1000 * 60 * 60 * 24));
      const daysUntilExam = Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24));
      console.log(timeToExam)
      console.log(daysUntilExam)

      let growthLevel;
      if (daysUntilExam <= timeToExam / 3) {
        growthLevel = 3;
      } else if (daysUntilExam <= (2 * timeToExam) / 3) {
        growthLevel = 2;
      } else {
        growthLevel = 1;
      }

      this.setState({ growthlvl: growthLevel });

      if (growthLevel >= 3) clearInterval(growthInterval); // Stop growth after adult stage
    }, 0); 
    
  }

  loadHappinessFromStorage = async () => {
    try {
      const happiness = await loadHappiness();
      if (happiness !== null) {
        this.setState({ happiness });
      }
    } catch (error) {
      console.error('Error loading happiness value:', error);
    }
  };

  loadHungerFromStorage = async () => {
    try {
      const hunger = await loadHunger();
      if (hunger !== null) {
        this.setState({ hunger });
      }
    }
    catch (error) {
      console.error('Error loading hunger value:', error);
    }
  };

  saveHappinessToStorage = async () => {
    const { happiness } = this.state;
    try {
      await saveHappiness(happiness);
    } catch (error) {
      console.error('Error saving happiness value:', error);
    }
  };

  handleInteraction = () => {
    this.setState({
      lastInteractionTime: new Date(),
    });
  };

  render() {
    const { happiness, name, images,growthlvl, currentImageIndex, careMistakes } = this.state;
    let currentImage;
    

    // Select the image based on growth level
    if (growthlvl === 0) {
      currentImage = images[5]; // Baby stage image
    } else if (growthlvl === 1) {
      currentImage = images[6]; // Young stage image
    } else {
      currentImage = images[0]; // Adult stage image
    }
    
    //This piece of code changes the current image of the pet depending on the growth level
    //<Image source={images[currentImageIndex]} style={styles.image} />  this is the original code for the pet photo
    return (

      <View>
        {images && images.length > 0 &&(
        <View style={{alignItems: 'center', position: 'relative'}}>
            <TouchableOpacity onPress={()=>{handleClick()}} style={styles.debug} ><Text>< FontAwesome6 name="soap" size={200} color="#cdb4db" /> </Text></TouchableOpacity>
            <Image source={currentImage} style={styles.image} />
        </View>
        )}
        <Text style={styles.name}>{name}</Text>
        {/* <Text>Care Mistakes: {careMistakes}</Text> */}
        <Text style={styles.growth}>Growth Level: {growthlvl}</Text> 
        
        {/* <Text>Care Mistakes: {careMistakes}</Text> */} 
        {/*uncomment line above to show care mistakes on the screen*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    alignItems: 'center',
    color: '#288a42',
    fontSize: 30,
  },
  image: {
    width: 200,
    height: 210,
    marginTop: 70,
    marginBottom: 0,
  },
  debug: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    elevation: 3,
  },
});

export default Pet;
export { loadHappiness, loadHunger };
