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
    // Consider making a library with a function fetchJSON that does the .then(response => response.json()) part
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
    return new Date(dt_dict.year, dt_dict.month, dt_dict.day, dt_dict.hours, dt_dict.minutes, dt_dict.seconds, dt_dict.milliseconds);
  }
  getRows = () => {
    let len = (this.props.collects.length)
    console.log("length: ", len)
    let rows = (len - (len % 3)) / 3
    if (len % 3 != 0 ) {
      rows += 1
  }
    console.log("number of rows: ", rows )
    return rows
  }

  // makeTable = () => {
  //   let col = 1
  //   return (
  //     <table><tbody>
  //       {if (col === 1) {() => {return <tr><td>}}
  //        else { () => {return <td>} } }
  //     { this.props.collects.map ( 
  //       (collect) => {
  //               <div key={collect.kao_id} className="collect text-justify in-line">
  //                 <span className="kao"> { collect.kao_str }</span>
  //               </div>
  //               { if (col === 3) { () => {return </td></tr>}}
  //                 else { () => {return </td> }} }
                
  //             })
  //     }
  //   )
  // }
  rowOpen = (i) => {
    if (i % 2 === 0) {
      return `<tr><td>`
    }else { return `<td>`}
  }
  rowClose = (i) => {
    if (i % 2 === 0) {
      return `</td>`
    }else { return `</tr></td>`} 
  }


  render () {
    console.log("collects are: ",this.props.collects)
    return (

      <div className="collects card col-7 text-justify">
        <h3> Your collected Kao-moji  </h3>

          { this.props.collects.map ((collect,i) => {
             return (
              /*{ this.rowOpen(i) }*/
              <div key={collect.kao_id}  className="collect text-justify in-line">
                <span className="kao" id={i}> { collect.kao_str }</span>
                
              </div>
              /*{ this.rowClose(i)}*/
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
      <div className="user-info-settings card col-4 list-group">
        <h3> User Settings </h3>
        <p>username: {this.props.user.username}</p>
        <p>email: {this.props.user.email}</p> 

        <p>Change email <span className="text-muted"> (coming soon!)</span></p>
        <p>change password
          <span className="text-muted"> (coming soon!)</span>
          </p>
        <p>change timezone
          <span className="text-muted"> (coming soon!)</span>
        </p>
      </div>
      )
  }
}


export default withRouter(UserPage)

