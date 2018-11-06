"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'



class EditTaskPage extends React.Component {
	constructor () {
    super ();
    this.state = {
        taskData: null,
        EOD: {}
	    };
	  }

	// get-task-dict.json
	fetchTaskDict = () => {
	// Consider POSTing the ID to get only the task you need
    fetch('/get-task-dict.json')
    .then(response => response.json())
    .then( data => {console.log("data is: ",data);
    	let taskid = this.props.match.params.id; 
    	// console.log("task id is: ",taskid); 
    	let task = data[taskid]
    	// console.log("task is: ",task)
    	task.due_date=this.assemble_date(task.due_date)
    	return task
    })
    .then(data => { 
    	// console.log("this data should be a task: ", data);

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
  componentWillMount() {
    if (session.current_username === 'None' ) {
      this.props.history.push('/')
    }
  }
  componentDidMount () {
    if (session.current_username !== 'None'){
        this.fetchTaskDict()
        console.log("edit task page state: ",this.state)
        this.fetchEOD()
	  }
	}
  assemble_date(dt_dict) {
    return new Date(dt_dict.year, dt_dict.month, dt_dict.day, 
    							  dt_dict.hours, dt_dict.minutes, dt_dict.seconds, dt_dict.milliseconds);
	}

	render () {
		
		return (
			<div className="edit-task-page">
				{this.state.taskData && <EditTaskForm task={this.state.taskData} EOD={this.state.EOD} assemble_date={this.assemble_date}/>}
				{this.state.taskData && <GoogleCalEventBtn task_id={this.state.taskData.task_id} /> }


			</div>
			)
	}
}
class EditTaskForm extends React.Component {


	formatDefaultDate () {
		let day = this.props.task.due_date.getDate()

		if (day < 10) {
			day = "0" + day.toString()
			// console.log("day is: ", day )
		}
		let defaultDate = this.props.task.due_date.getFullYear()+ "-" + this.props.task.due_date.getMonth() + '-' + day
		// console.log("within the function, the defaultDate is: ",defaultDate)


		return defaultDate


	}

	formatDefaultTime () {
		let dt = this.props.task.due_date
		// Need the same hours < 10 check here?
		let hours = dt.getHours()
		let mins = dt.	getMinutes()
		if (mins < 10) {
			mins = "0" + mins.toString()
		}

		let defaultTime = hours.toString() + ":" + mins.toString()
		// console.log("default time is: ", defaultTime)
		return defaultTime
	}



	render() {
		// {this.props.taskData.is_repeating && "checked"} 
		// {...this.props.task.is_repeating && "checked"}
		// console.log(this.props.task)


		
		let defaultDate = this.formatDefaultDate()
		let defaultTime = this.formatDefaultTime()

		// Consider sharing code between this form and addtask.jsx
		// console.log(this.props.task.msg, "has a due date of", this.props.task.due_date, "and eod is:", this.props.EOD)
		// console.log("the comparison is: ", this.props.task.due_date < this.props.EOD) 
		return (
			<form method="POST" action="/confirm-edit">
			  <table>
			    <tbody>
			    <tr>
			      <td>Task</td>
			      <td>
				      <input type="text_box" name="msg" size="37" defaultValue={this.props.task.msg} />

							<input className="remove" value={this.props.task.task_id} name="task_id"  readOnly /> 
				      
			      </td>
			    </tr>
			    <tr>
			      <td>Due date</td>
			      <td>
			        <input type="date" name="duedate" defaultValue={defaultDate} />
			        <input type="time" name="duetime" />
			      </td>
			    </tr>
			    <tr>
			      <td></td><td> 

			        <input type="checkbox" 
			             value="today"
			             name="today" 
			             defaultChecked={this.props.task.due_date < this.props.EOD} /> (Due today)
			      </td>
				  {/*Consider making clicking here change the value in the date input*/}
			    </tr>
			    <tr>
			       <td>
			       </td>
			       <td> 
				       <input type="checkbox" defaultValue="True" name="repeating" defaultChecked={this.props.task.is_repeating} /> (Repeat daily)
			       </td>
			    </tr>
			    <tr><td> 
			      <input type="submit" defaultValue="Update" readOnly /> 
			    </td><td><Link to="/tasks"> Cancel</Link></td></tr>
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
			  <input value={this.props.task_id} readOnly name="task_id" hidden /> 
			  <input type='submit' readOnly value="Create Google Calendar Event" className="cal-btn" />
			</form>
			)
	}
}


export default withRouter(EditTaskPage)
