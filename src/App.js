import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import './App.css';

const app = new Clarifai.App({
  apiKey:'283a5a210b934f51af43ea39a16d3820'
});

const particlesOptions = {
  particles: {
    number: {
      value: 120,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      },
      resize: true
    },
    modes: {
      repulse: {
        distance: 150 ,
        duration: 0.4
      },
    }
  },
  retina_detect: true
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions.map(region => region.region_info.bounding_box);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return clarifaiFaces.map (face => {
      return {
        topRow: height * face.top_row,
        leftCol: width * face.left_col,
        bottomRow: height - (height * face.bottom_row),
        rightCol: width - (width * face.right_col)
      }
    });
  }

  displayFaceBox = (boxes) => {
    console.log(boxes);
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  render() { 
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Logo />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
