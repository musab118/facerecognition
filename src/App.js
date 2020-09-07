import React, { Component } from "react";
import "./App.css";
import Clarifai, { FACE_DETECT_MODEL } from "clarifai";
import Navigation from "./components/Navigation/Navigation";
import SignIn from "./components/SignIn/SignIn";
import Register from './components/Register/Register'
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

const app = new Clarifai.App({
  apiKey: "e11a6cf77ae14b599eef0f11c5bd91e2",
});

class App extends Component {
  // constructir is a method used to initialize an objects state in a class
  constructor() {
    // super () calls the constructor of its parents class
    super();

    // this is defining the default state of speicific states
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: true,
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFaceBox(this.calculateFaceLocation(response)).catch((err) =>
          console.log(err)
        )
      );
  };

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({isSignedIn:false})
    } else if (route === 'home') {
      this.setState({isSignedIn:true})
    }
    this.setState({ route: route });
  };

  render() {
const {isSignedIn, box, imageUrl, route} =  this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === "home" ? (
          <div>
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition
            box={box}
            imageUrl={imageUrl}
          />
        </div>
          
        ) : (
            this.state.route === 'signin' ?
          <SignIn onRouteChange={this.onRouteChange} />
          : <Register onRouteChange = {this.onRouteChange} />
        )
        
        }
      </div>
    );
  }
}

export default App;
