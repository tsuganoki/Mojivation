"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';


class UserPage extends React.Component {
  
  constructor () {
    super ();
    this.state = {
        user: {},
        kaos: []
    };
  }
  updateUserState (argument) {
      this.setState( {user: argument} );
  }
  updateKaosState (argument) {
      this.setState( {kaos: argument} );
  }
  componentWillMount() {
    if (session.current_username === 'None' ) {
      this.props.history.push('/')
    }
  }
  componentDidMount () {
    this.fetchUserData()
    this.fetchKaosData()
  }
  fetchUserData = () => {
    fetch('/get-user-info.json')
    .then(response => response.json())

    .then(data => this.setState( {user:data} ) )
  }
  fetchKaosData = () => {
    fetch('/get-kaos.json')
    .then(response => response.json())

    .then(data => this.setState( {kaos:data} ) )
  }
  

  render () {
    // console.log("session: ", session)




    return (
      <div> 
        <Collects collects={this.state.kaos} />
        <UserInfo user={this.state.user} />
     </div>
      )
  }
}

 class Collects extends React.Component {


  assemble_date(dt_dict) {
  // const d = new Date(dt_dict."year", dt_dict."month",
  //  dt_dict."day", dt_dict."hours", dt_dict."minutes",
  //   dt_dict."seconds", dt_dict."milliseconds");

  var d = new Date(dt_dict.year, dt_dict.month, dt_dict.day, dt_dict.hours, dt_dict.minutes, dt_dict.seconds, dt_dict.milliseconds);

  return d
}


  render () {
    return (

      <div className="collects">
        <h3> Your collected Kao-moji  </h3>
          { this.props.collects.map ((collect) => {
             return (
              <div key={collect.kao_id} className="collect">
                <span className="kao"> { collect.kao_str } {console.log(collect.kao_str)}</span>
                <br />
                <span className="collect-date small-text">
                  { console.log(this.assemble_date(collect.date)) }

                </span>
              </div>
              )
                  }   
            )
          }
      </div>
      )}
  }
 class UserInfo extends React.Component {
  render () {
    return (
      <div className="user-info-settings">
        <h3> User Settings </h3>
        <p>username: {this.props.user.username}</p>
        <p>email: {this.props.user.email}</p> 

        <p>Change email</p>
        <p>change password</p>
        <p>change timezone</p>
      </div>
      )
  }
}


export default withRouter(UserPage)

