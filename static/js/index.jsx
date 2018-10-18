"use strict";

/* component start */ // These comments are for rendering handouts!
class Slogan extends React.Component {


  render() {
    return <p>Hi SLOGAN!</p>;
  }
}
/* component end */





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
    <div>
      <JQueryWeatherAlert />
      <WeatherAlert />
      <Slogan />,

    </div>
  ),
  document.getElementById('root'),
);




 