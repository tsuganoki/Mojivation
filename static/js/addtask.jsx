"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import {withRouter} from 'react-router-dom';


class AddTaskPage extends React.Component {
  componentWillMount() {
    if (session.current_username === 'None' ) {
      this.props.history.push('/')
    }
  }
	render () {
				// Consider sharing code between this form and edittask.jsx

		return (
				<div id="new-task-block">
				<form method="POST" action="/add_new_task">
					  <table>
					    <tbody>
					    <tr>
					      <td>Task</td>
					      <td><input type="text_box" 
					             name="msg"
					             size="37" 
					             required />
					 
					      </td>
					    </tr>
					    <tr>
					      <td>Due date</td>
					      <td><input type="date" 
					             name="duedate" /> 
					          <input type="time" 
					             name="due_time" />
					          
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
					       <td> <input type="checkbox" 
					                value="True"
					                 name="repeating" /> (Repeat daily)
					       </td>
					    </tr>
					    <tr><td> 
					      <input type="submit" value="Add" /> 
					    </td><td><Link to="/tasks"> Cancel</Link></td></tr>
					  </tbody>
					  </table>
					</form>
				</div>

			)
	}

}




export default withRouter(AddTaskPage)
