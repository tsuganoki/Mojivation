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
				<div className="card col-5" id="new-task-block">
				<form method="POST" action="/add_new_task">
					    
					<div className="form-group">
			      <label className="col-form-label">Task</label>
			      <input className="form-control col-xs-4" id="task" type="text_box" 
			             name="msg"
			             required />
	        </div>
					 
					      
					    
					    
					<div className="form-group ">
				      
				      <table><tbody><tr><td>
					      <label className="col-form-label" htmlFor="due_date">Due date</label>
					      <input className="form-control col-xs-4" id="due_date" type="date" 
					             name="duedate" /> 
					             </td><td>
					      <label className="col-form-label" htmlFor="due_time">Due Time</label>
			          <input className="form-control col-xs-4 in-line" id="due_date" type="time" 
				               name="due_time" />
			       </td></tr></tbody></table>        
           </div>
					     
					      
					    
	  				<div className="form-group">
		  				<div className="custom-control custom-checkbox"> 
								<input className="custom-control-input" 
									 id="due_today" type="checkbox" 
			             value="today"
			             name="today" /> 
		             <label className="custom-control-label" htmlFor="due_today"> (Due today)  </label>
						   </div>
					   </div>


	  				 <div className="form-group">
				  				<div className="custom-control custom-checkbox"> 
						        <input className="custom-control-input" 
						              id="is_repeating" type="checkbox" 
					                value="True"  name="repeating" /> 
		                 <label className="custom-control-label" htmlFor="repeating"> (Repeat daily)</label>
	                 </div>
					       </div>

					    
					     
									<div className="form-group">
					      <input className="btn btn-secondary in-line" id="submit" type="submit" value="Add" /> 
					    <Link to="/tasks"> Cancel</Link>
					    </div>

					</form>
				</div>

			)
	}

}




export default withRouter(AddTaskPage)
