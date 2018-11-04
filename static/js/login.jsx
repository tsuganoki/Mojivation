"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

class LoginPage extends React.Component {
	render () {
		return (
			<div className="login-page">
				<form action='/login_confirm' method="POST" name='login'>
					<table>
						<tbody>
						<tr>
							<td>Username</td>
							<td> <input type="textbox" name="username" /></td></tr>
						<tr>
							<td>Password</td>
							<td><input type="password" name="password" /></td>
						</tr>
						<tr><td> 
							<input type="submit" value="login" />
						</td><td></td></tr>
						</tbody>
				</table>
			</form>

			


			<div className="register-div">
				<a href="/register">
					Register
				</a>
			</div>
			</div>
			)
	}

}
export default withRouter(LoginPage)
