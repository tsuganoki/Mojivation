"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

class EditTaskPage extends React.Component {
	render () {
		console.log("task is:",this.props.task)
		return (
			<div className="edit-task-page">
				<GoogleCalEventBtn />
			</div>
			)
	}
}
class EditTaskForm extends React.Component {

	checked = () => {
		// {this.props.task.is_repeating && checked()} 
		return "checked"
	}
	render() {
		return (
			<form method="POST" action="/confirm-edit">
			  <table>
			    <tbody>
			    <tr>
			      <td>Task</td>
			      <td>
				      <input type="text_box" name="msg" size="37" value={this.props.task.msg} />
							<input value={this.props.task.task_id} name="task_id" hidden /> 
			      </td>
			    </tr>
			    <tr>
			      <td>Due date</td>
			      <td>
			        <input type="date" name="duedate" />
			        <input type="time" name="duetime"value={this.props.task.due_date} />
			      </td>
			    </tr>
			    <tr>
			      <td></td><td> 
			        <input type="checkbox" 
			             value="today"
			             name="today" /> (Due today)
			      </td>
			    </tr>
			    <tr>
			       <td>
			       </td>
			       <td> 
				       <input type="checkbox" value="True" name="repeating" />
				       (Repeat daily)
			       </td>
			    </tr>
			    <tr><td> 
			      <input type="submit" value="Update" /> 
			    </td><td><a href="/tasks"> Cancel</a></td></tr>
			  </tbody>
			  </table>
			</form>
			)

	}
}
class GoogleCalEventBtn extends React.Component {
	// {this.props.task.task_id} 
	render () {
		return(

			<form method="POST" action="/create-cal-event">
			  <input value="40" readOnly name="task_id" hidden /> 
			  <input type='submit' value="Create Google Calendar Event" className="cal-btn" />
			</form>
			)
	}
}


export default withRouter(EditTaskPage)
