	console.log('POTATO'); 
$(document).ready(function() {
	$.get('get-tasks.json', function (data) {

		let tasks = data.tasks
		let py_EOD = data.EOD

		EOD = assemble_date(py_EOD)

		for (let task of tasks) {
			if (task.is_complete === false && assemble_date(task.due_date) >= EOD ) {
				$('#today-tasks-ul').append(getIncompleteTaskHTML(task))
			}else if (task.is_complete === false && assemble_date(task.due_date) < EOD ) {
				$('#later-tasks-ul').append(getIncompleteTaskHTML(task))
			}else if (task.is_complete) {
				$('#completed-tasks-ul').append(getCompletedTaskHTML(task))
			};
			

		};
	})		
});

function getIncompleteTaskHTML (task) {
	let taskHTML = `
      <form action="/complete-task" method="POST">
        <input hidden 
             name="task_id" 
             value=` + task.task_id + `>
      <li>
        <input type=submit name="complete" value="Done"> 
        <a class="task-msg" 
           href="/edit_task/` + task.task_id + `">
            ` + task.msg + `
        </a>

        <a href="/delete-task-` + task.task_id + `">
          <i class="fa fa-times-circle-o ex-cirle" aria-hidden="true" alttext="delete task"></i>
        </a>
      </li>
    </form>`


	return taskHTML;
};


function getCompletedTaskHTML (task) {

	let taskHTML = `
	  <form action="/undo_complete" method="POST">
			<li class="completed-task-li">
			  <input hidden name="task_id" value=`+ task.task_id +`>
				<input type="submit" value="Undo"><a class="task-msg" href="/edit_task/`+ task.task_id+`"> `+ task.msg+` </a>
					<a href="/delete-task-`+ task.task_id+`">
					<i class="fa fa-times-circle-o ex-cirle" aria-hidden="true" alttext="delete task"></i></a>
			</li>
		</form>`


		// taskHTML += "<form action=\"/undo_complete\" method=\"POST\"><input hidden name=\"task_id\" value="+ task.task_id +">"
	
	return taskHTML;
}


$(".task-button").click(function () {
	console.log("button clicked");

});


function assemble_date(dt_dict) {
	// const d = new Date(dt_dict."year", dt_dict."month",
	//  dt_dict."day", dt_dict."hours", dt_dict."minutes",
	//   dt_dict."seconds", dt_dict."milliseconds");

	var d = new Date(dt_dict.year, dt_dict.month, dt_dict.day, dt_dict.hours, dt_dict.minutes, dt_dict.seconds, dt_dict.milliseconds);

	return d
}


// function updateTasks(data) {
// 	console.log(data)
// 		$('test_tasks').html(data);
// };


// $('#this_div').html("this text has been changed to <a href=\"http://google.com\">A LINK TO GOOGLE</a>");

// allTasks = $.get("/get-tasks.json")
// let todayTasks = document.querySelector('#today-tasks')


// let enddiv = document.querySelector('#enddiv')
// enddiv.innerHTML('hello')

// let enddiv = document.querySelector('#this_div');
// enddiv.innerText = "APPLE"

// // logBtn.innerText = 'Log Off'