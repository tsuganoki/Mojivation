"use strict";




class TasksPage extends React.Component {
	constructor () {
		super ();
		this.state = {
				taskData: [],
				EOD: {}
		};
	}

	updateTaskData (argument) {
    	this.setState( {taskData: argument} );
	}
	componentDidMount () {
		this.fetchTaskData()
		this.fetchEOD()
	}
	assemble_date(dt_dict) {
	// const d = new Date(dt_dict."year", dt_dict."month",
	//  dt_dict."day", dt_dict."hours", dt_dict."minutes",
	//   dt_dict."seconds", dt_dict."milliseconds");

	var d = new Date(dt_dict.year, dt_dict.month, dt_dict.day, dt_dict.hours, dt_dict.minutes, dt_dict.seconds, dt_dict.milliseconds);

	return d
	}

	fetchTaskData  = () => {
		let that = this
		console.log("TasksPage.this: ",this)
		fetch('/get-tasks.json')
		.then(response => response.json())

		.then(data => this.setState( {taskData:data} ) )

	}

	fetchEOD () {
		fetch('/get-eod.json')
		.then(response => response.json())

		.then(data => this.setState( {EOD:this.assemble_date(data)} ) )
		console.log


	}
	getTodayTasks = (tasksData) => {
		let todayTasks = []
		todayTasks = tasksData.filter ( task => this.assemble_date(task.due_date) <= this.state.EOD 
											&& task.is_complete === false)
		return todayTasks



	}
	getLaterTasks = (tasksData) => {
		let laterTasks = []
		laterTasks = tasksData.filter ( task => this.assemble_date(task.due_date) > this.state.EOD 
											&& task.is_repeating === false 
											&& task.is_complete === false)
		return laterTasks



	}
	getCompletedTasks = (tasksData) => {
		let completeTasks = []
		completeTasks = tasksData.filter ( task => task.is_complete === true )
		return completeTasks



	}
	render () {
		return (
			<div>
				<TaskBlock tasks={this.getTodayTasks(this.state.taskData)} blockName='Due Today' showQuickAdd='True' />
				<TaskBlock tasks={this.getLaterTasks(this.state.taskData)} blockName='Due Later'/>
				<TaskBlock tasks={this.getCompletedTasks(this.state.taskData)} blockName="Completed" showClearCompleted="True"/>
			</div>
		)
	}
}



class TaskBlock extends React.Component {

	render () {


		return (

			<div className="today-tasks">
			  <h3>{this.props.blockName}</h3>
			  <span id="EOD-span" className="small-text remove" >EOD is:  sometime UTC</span> 
			  <ul>
			  	{ this.props.tasks.map ((task) => {
								 return <li key={task.task_id}><Task task={task}/></li>
									  	}		
					  		)
				}
			  </ul>
			  {this.props.showQuickAdd && <QuickAdd /> }
			  {this.props.showClearCompleted && <ClearCompleted /> }

  
			</div>
			)
	}
}

class QuickAdd extends React.Component {
	render () {
		return (
			<div className="quick-add">
    <form method="POST" action="/add_new_task">
      <input type="text_box" 
           required 
           name="msg" />

      <input hidden name="duedate" defaultValue="" />
      <input type="submit" defaultValue="Quick Add" />
      <p id="quick-add-info">
        * Quick add due date auto completes to today
      </p>
    </form>
  </div>)
	}

}
class ClearCompleted extends React.Component {
	render () {
		return <a href="/clear-all-completed">Clear Completed</a>
	}
}

class CompleteTaskBtn extends React.Component {

	completeTask() {
		// put the thing that makes it not do the thing
		console.log("attempting to complete task")
		fetch()
};


	render () {
		let completeTaskRoute = this.props.task_id.toString()
		return (
			<form className="in-line" action="/complete-task" method="POST">
				<input hidden name="task_id" defaultValue={completeTaskRoute} />
				<input type="submit" name="complete" value="Done" onClick={this.completeTask}/>
			</form>
		)
	}
}


class Task extends React.Component {
	constructor () {
		super ();
		this.state = {
			deleteIconVisibility: ""
		};
	}

	showDeleteIcon() {
		this.setState( {deleteIconVisibility: none})

	}
	hideDeleteIcon() {
		this.setState( {deleteIconVisibility: hidden})

	}
	

	render() {
		let completeTaskRoute = this.props.task.task_id.toString()
		let edit_task_route = 'edit_task/' + this.props.task.task_id.toString()
		let delete_task_route = 'delete-task-' + this.props.task.task_id.toString()
		// let _getTasks = this.getTasks

		return (
			<div>
				<CompleteTaskBtn task_id={this.props.task.task_id} /> <a className="task-msg in-line" href={edit_task_route}>  {this.props.task.msg} </a>

				<a href={delete_task_route} >
					<i className="fa fa-times-circle-o ex-cirle" 
					aria-hidden="true" 
					alttext="delete task"></i>
				</a>
			</div>


			
		);

	};
}


ReactDOM.render (
	(
		<TasksPage />
		),
	document.getElementById('root'),
	);

// <JQueryWeatherAlert />
      // <WeatherAlert />


