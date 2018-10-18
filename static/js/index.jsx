"use strict";

class Slogan extends React.Component {
	// randomProp (obj) {
	// 	var keys = Object.keys(obj)
 //    return obj[keys[ keys.length * Math.random() << 0]];
	// }
	alertMe () {
		console.log("ALART")
	}

  
  render() {
  	let slogans  = {
        "shrug": "¯\_(ツ)_/¯ Guess we can be productive today",
        "supportive": "~(˘▽˘~) I know you can do it!",
        "dog": " ∪･ω･∪ Today's Oppawtunities are full of pet-tential",
        "boxer": "(งಠ_ಠ)ง It's the eye of the tiger, it's the thrill of the fight...",
        "mage": "(ﾉ>ω<)ﾉ :｡･:*:･ﾟ’★,｡･:*:･ﾟ’☆ Abracadabra! Lets be productive!",
        "bear": "ʕ •̀ ω •́ ʔ Keep going! You can bear it!",
        "allieB": "╰(°ロ°)╯ Do all the things!"
        }
    let slogan = randomProperty(slogans);
    // console.log(slogan);
    return <p> { randomProperty(slogans) }</p>;
    	
    	
    
  }
}
/* component end */

var randomProperty = function (obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
};



/* start jQuery component */
class JQueryWeatherAlert extends React.Component {
  // Callback function
  alertWeather = () => {
    $.get('/slogan.json', data => {
      alert("The weather will be " + data.forecast);
    });
  }

  render() {
    return (
      <button onClick={this.getWeather}>
        Get Weather with JQuery
      </button>
    );
  }
}
/* end jQuery component */


/* start component */
class FetchWeatherButton extends React.Component {
  getWeather = () => {
    fetch('/random/weather.json')
      .then(response => response.json())
      .then(data => alert(`The weather will be ${data.forecast}`));
  }

  render() {
    return (
      <button onClick={this.getWeather}>
        Get Weather with Fetch
      </button>
    );
  }
}
/* end component */

ReactDOM.render(
  (
    	<Slogan slogan="¯\_(ツ)_/¯ Guess we can be productive today."/>
      
  ),
  document.getElementById('slogan'),
);

// <JQueryWeatherAlert />
      // <WeatherAlert />


 