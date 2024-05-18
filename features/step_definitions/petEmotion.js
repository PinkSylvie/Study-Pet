const {Given, When, Then} = require('@cucumber/cucumber');

let pet


Given('the pet\'s growth level is {int}', function (growthLevel) {
    pet = new Pet({ growthlvl: growthLevel, images: [
      require('../../components/PetImages/FrogImages/animatedFrog.gif'),
      require('../../components/PetImages/FrogImages/animatedFrog(sad).gif'),
      require('../../components/PetImages/FrogImages/animatedFrog(angry).gif'),
      require('../../components/PetImages/FrogImages/animatedFrog(happy).gif'),
      require('../../components/PetImages/FrogImages/animatedFrog(dead).gif'),
      require('../../components/babyfrog.png'),
      require('../../components/youngfrog.png'),
    ]});
  }); // Mocked images array can be provided here;
  
  Given('the pet\'s happiness level is {int}', function (happinessLevel) {
    pet.props.happiness = happinessLevel;
  });
  
  Given('the pet\'s care mistakes are {int}', function (careMistakes) {
    pet.props.careMistakes = careMistakes;
  });
  
  When('the image selection logic is executed', function () {
    currentImage = pet.getCurrentImage();
  });
  
  Then('the current image should be the baby stage image', function () {
    // Replace with assertion for the baby stage image index
    expect(currentImage).toEqual(5);
  });
  
  Then('the current image should be the young stage image', function () {
    // Replace with assertion for the young stage image index
    expect(currentImage).toEqual(6);
  });
  
  Then('the current image should be the happy adult frog image', function () {
    // Replace with assertion for the happy adult frog image index
    expect(currentImage).toEqual(3);
  });
  
  Then('the current image should be the sad adult frog image', function () {
    // Replace with assertion for the sad adult frog image index
    expect(currentImage).toEqual(1);
  });
  
  Then('the current image should be the default image', function () {
    // Replace with assertion for the default image index
    expect(currentImage).toEqual(0);
  });
  