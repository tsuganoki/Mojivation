"use strict";




class TasksPage extends React.Component {
	constructor () {
		super ();
		this.state = {
				taskData: {},
				EOD: {}
		};
	}

	updateTaskData (argument) {
    	this.setState( {taskData: argument} );
	}


	fetchTaskData (tasksObj) {
		let that = this
		fetch('/get-tasks.json')
		.then(response => response.json())

		.then(data => this.setState( {taskData:data} ) )
		// .then(data => console.log(data) )

    	console.log("fetchTaskData method has run")

	}

	fetchEOD () {
		fetch('/get-eod.json')

	}
	render () {
		return (
			<div>
				<FetchTasksBtn onClick={this.fetchTaskData} />

				<TaskBlock blockName='Due Today' showQuickAdd='True' />
				<TaskBlock blockName='Due Later'/>
				<TaskBlock blockName="Completed" showClearCompleted="True"/>
			</div>
		)
	}
}

class FetchTasksBtn extends React.Component {


		render () {
			return <p><button onClick={this.props.onClick}>fetch Tasks </button></p>
		}

}


class TaskBlock extends React.Component {


	render () {
		let tasks = [{task_id : 40, task_msg : 'Implement states on all components ' }, 
		{task_id : 41, task_msg : 'REACT '}]

		return (

			<div className="today-tasks">
			  <h2>{this.props.blockName}</h2>
			  <span id="EOD-span" className="small-text remove" >EOD is:  sometime UTC</span> 
			  <ul>
			  	{ tasks.map ((task) => {
								  		return <li key={task.task_id}><Task task_msg={task.task_msg} task_id={task.task_id} /></li>
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
		event.preventDefault()
		alert("Completed Task")
};


	render () {
		let completeTaskRoute = this.props.task_id.toString()
		return (
			<form action="/complete-task" method="POST">
				<input hidden name="task_id" defaultValue={completeTaskRoute} />
				<input type="submit" name="complete" value="Done" onClick={this.completeTask}/>
			</form>
		)
	}
}


class OldFetchTasksButton extends React.Component {
  getWeather = () => {
    fetch('/get-tasks.json')
      .then(response => response.json())
      .then(data => console.log(`The first task is:  ${data.tasks[0].msg}`));
  }

  render() {
    return (
      <button onClick={this.getWeather}>
        print tasks to console
      </button>
    );
  }
}

class Task extends React.Component {
	

	render() {
		let completeTaskRoute = this.props.task_id.toString()
		let edit_task_route = 'edit_task/' + this.props.task_id.toString()
		let delete_task_route = 'delete-task-' + this.props.task_id.toString()
		// let _getTasks = this.getTasks

		return (
			<div>
				<CompleteTaskBtn task_id={this.props.task_id} />

				<a className="task-msg" href={edit_task_route}>  {this.props.task_msg} </a>

				<a href={delete_task_route}>
					<i className="fa fa-times-circle-o ex-cirle" aria-hidden="true" alttext="delete task"></i>
				</a>
			</div>


			
		);

	};
}

// ReactDOM.render(
//   (
//   		<div>
// 	  		<Task task_msg=" Make a react component" task_id={40}/>
// 	  		<Task task_msg=" Make another one!" task_id={41}/>
//   		</div>
//   ),
//   document.getElementById('task'),
// );


ReactDOM.render (
	(
		<TasksPage />
		),
	document.getElementById('root'),
	);

// <JQueryWeatherAlert />
      // <WeatherAlert />


