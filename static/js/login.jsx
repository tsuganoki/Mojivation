"use strict";
import React from 'react';
import ReactDOM from 'react-dom';


export class LoginPage extends React.Component {
	render () {
		return (
			<div className="login-page">
			<form action='/login_confirm' method="POST" name='login'>
				<table>
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
				</table>
			</form>

			</p>


			<div className="register-div">
				<a href="/register">
					Register
				</a>
			</div>
			</div>
			)
	}

}
