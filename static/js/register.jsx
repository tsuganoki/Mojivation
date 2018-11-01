"use strict";
import React from 'react';
import ReactDOM from 'react-dom';


export class RegisterPage extends React.Component {

	constructor () {
    super ();
    this.state = {
        timezones: []
    };
  }
  componentDidMount () {
    this.fetchTimezones()
	}

	fetchTimezones = () => {
    fetch('/get-timezones.json')
    .then(response => response.json())
    .then(data => this.setState( {timezones:data } ) )
  }


	render(){
		console.log(this.state.timezones)
		return (
			<div className="registrationPage">
			<form action='/register_confirm' method="POST">
				<table>
				<tbody>
					<tr>
						<td>Username</td>
						<td> <input type="textbox" 
									name="username" required 
									pattern=".{3,}" /></td></tr>
					<tr>
						<td>E-mail</td>
						<td> <input type="email" 
									name="email" 
									required />
						</td>
					</tr>
					<tr>
						<td>Password
							<br /><span id="small-text">
								At least 5 characters
							</span>
						</td>
						<td> <input type="password" 
									name="password1" 
									required 
									pattern=".{5,}" />
						</td>
					</tr>
					<tr>

						<td>Retype Password</td>
						<td> <input type="password" 
									name="password2" 
									required 
									pattern=".{5,}" />
						</td>
					</tr>
					<tr>

						<td>Timezone</td>
						<td> 
							<select name="timezone" required>

							{this.state.timezones.map  ((zone) => {
									return (<option key={zone} value={zone}> {zone} </option>)
									} )
			          }

								
								

							</select>
								
						</td>
					</tr>
					<tr>
						<td> 
						<input type="submit" value="Register" />
						</td>
						<td></td>
					</tr>
					</tbody>
				</table>
			</form>
			</div>
			)
	}


}








