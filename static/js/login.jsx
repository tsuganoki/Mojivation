"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

class LoginPage extends React.Component {
	render () {
		return (
			<div className="login-page card col-5">
				<form action='/login_confirm' method="POST" name='login'>
					
					<div className="form-group">
					  <label className="col-form-label">Username</label>
					  <input required type="text" size="37" className="form-control col-xs-4" id="username" name="username" />
					</div>
					<div className="form-group">

						<label className="col-form-label col-xs-4">Password </label>
						<input className="form-control col-xs-4"  size="37" id="password" type="password" name="password" />
					              

					</div>
					<div className="in-line my-1 my-sm-0 form-group col-3">
						<input className="btn btn-secondary in-line" type="submit" value="Login" />
					
					</div>

			</form>

			


				
			</div>
			)
	}

}
export default withRouter(LoginPage)
