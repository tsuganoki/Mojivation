	console.log('POTATO'); 
$(document).ready(function() {
	$.get('get-tasks.json', function (data) {

		let tasks = data.tasks
		let EOD = data.EOD
		console.log(typeof(EOD))

		for (let task of tasks) {
			if (task.is_complete === false ) {
				$('#today-tasks-ul').append(getIncompleteTaskHTML(task))



			}
			else if (task.is_complete) {
				$('#completed-tasks-ul').append(getCompletedTaskHTML(task))
			}
			

		};
		

		$('.test_tasks').html("TEST_TASKS")


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
	// {% for task in tasks %}
 //    {% if task.is_complete %}
 //      <form action="/undo_complete" method="POST">
 //        <input hidden name="task_id" 
 //        value={{task.task_id}}>
 //        <input hidden name="potato" value="apple">
 //    <li class="completed-task-li">
 //        <input type="submit" value="Undo">
 //        {{task.msg}}
 //        <a href="/delete-task-{{task.task_id}}">
 //            <i class="fa fa-times-circle-o ex-cirle" aria-hidden="true" alttext="delete task"></i>
 //        </a>
 //    </li>
 //      </form>

 //    {% endif %}
 //    {% endfor %}



$(".task-button").click(function () {
	console.log("button clicked");

});



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