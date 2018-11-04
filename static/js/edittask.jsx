"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'



class EditTaskPage extends React.Component {
	constructor () {
    super ();
    this.state = {
        taskData: {},
        EOD: {}
	    };
	  }

	// get-task-dict.json
	fetchTaskDict = () => {
    fetch('/get-task-dict.json')
    .then(response => response.json())
    .then( data => {console.log("data is: ",data);
    	let taskid = this.props.match.params.id; 
    	console.log("task id is: ",taskid); 
    	let task = data[taskid]
    	console.log("task is: ",task)
    	task.due_date=this.assemble_date(task.due_date)
    	return task
    })
    .then(data => { 
    	console.log("this data should be a task: ", data);

	    this.setState( {taskData: data } ) 

    	}
 	)
	}
	fetchEOD = () => {
    fetch('/get-eod.json')
    .then(response => response.json())
    .then(data => this.setState( {EOD:this.assemble_date(data)} ) )
    // console.log('EOD is: ',this.state.EOD)
  }

  componentDidMount () {
    if (session.current_username !== 'None'){
        this.fetchTaskDict()
        console.log("edit task page state: ",this.state)
        this.fetchEOD()
	  }
	}
	assemble_date(dt_dict) {
  
    const d = new Date(dt_dict.year, dt_dict.month, dt_dict.day, 
    									 dt_dict.hours, dt_dict.minutes, dt_dict.seconds, dt_dict.milliseconds);

    return d
	}
	render () {
		
		return (
			<div className="edit-task-page">
				<EditTaskForm task={this.state.taskData} EOD={this.state.EOD} assemble_date={this.assemble_date}/>
				<GoogleCalEventBtn />


			</div>
			)
	}
}
class EditTaskForm extends React.Component {
	checked = () => {return 'checked'}




	render() {
		// {this.props.taskData.is_repeating && "checked"} 
		// {...this.props.task.is_repeating && "checked"}
		console.log(this.props.task)
		console.log(this.props.task.is_repeating)
		console.log("boolian is:",this.props.task.due_date < this.props.EOD)
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
			        <input type="time" name="duetime" value={this.props.task.due_date} />
			      </td>
			    </tr>
			    <tr>
			      <td></td><td> 
			        <input type="checkbox" 
			             value="today"
			             name="today" {...this.props.task.due_date < this.props.EOD && checked()}/> (Due today)
			      </td>
			    </tr>
			    <tr>
			       <td>
			       </td>
			       <td> 
				       <input type="checkbox" value="True" name="repeating" {...this.props.task.is_repeating && checked()} />
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
