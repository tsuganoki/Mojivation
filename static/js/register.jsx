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
			<div className="registrationPage card col-5">

				<form action='/register_confirm' method="POST">
					<div className="form-group">
					  <label className="col-form-label">Username</label>
						 <input className="form-control col-xs-4" id="username"
						 type="textbox" 
									name="username" required 
									pattern=".{3,}" />
									</div>
					
											<div className="form-group">
						<label className="col-form-label col-xs-4">E-mail</label>
						<input className="form-control col-xs-4" id="email"
						 type="email" 
									name="email" 
									required />
									</div>
						
					
					
											<div className="form-group">
						<label className="col-form-label col-xs-4">Password</label>
						<br /><span id="small-text">
								At least 5 characters
							</span>
						
						 <input className="form-control col-xs-4" id="password1"
						 type="password" 
									name="password1" 
									required 
									pattern=".{5,}" />
									</div>
						
					
					

					<div className="form-group">
						<label className="col-form-label col-xs-4">Retype Password</label>
						<input className="form-control col-xs-4" id="password2"
						 type="password" 
									name="password2" 
									required 
									pattern=".{5,}" />
					</div>
						
					
					

					<div className="form-group">
						<label className="col-form-label col-xs-4">Timezone</label>
						
							<select className="custom-select" name="timezone" required>

							{this.state.timezones.map  ((zone) => {
									return (<option key={zone} value={zone}> {zone} </option>)
									} )
			          }
							</select>
          </div>

					
						 <div className="in-line my-1 my-sm-0 form-group col-3">
							<input className="btn btn-secondary in-line" size="50" type="submit" value="Register" />
						</div>
						
						
					
					
				</form>
			</div>
			)
	}


}








