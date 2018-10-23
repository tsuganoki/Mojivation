"use strict";


class Task extends React.Component {

	render() {
		let completeTaskRoute = this.props.task_id.toString()
		let edit_task_route = 'edit_task/' + this.props.task_id.toString()
		let delete_task_route = 'delete-task-' + this.props.task_id.toString()

		return (
			<form action="/complete-task" method="POST">
		        <input hidden name="task_id" value={completeTaskRoute} />
		      
		        <input type="submit" name="complete" value="Done" />
		        <a class="task-msg" href={edit_task_route}> 
		            {this.props.task_msg}
		        </a>

		        <a href={delete_task_route}>
		          <i class="fa fa-times-circle-o ex-cirle" aria-hidden="true" alttext="delete task"></i>
		        </a>

		      
		    </form>
	         );

	};
}
class Slogan extends React.Component {
	// randomProp (obj) {
	// 	var keys = Object.keys(obj)
 //    return obj[keys[ keys.length * Math.random() << 0]];
	// }
	

  
  render() {
  	let slogans  = {
        "shrug": "¯\\_(ツ)_/¯ Guess we can be productive today",
        "supportive": "~(˘▽˘~) I know you can do it!",
        "dog": " ∪･ω･∪ Today's Oppawtunities are full of pet-tential",
        "boxer": "(งಠ_ಠ)ง It's the eye of the tiger, it's the thrill of the fight...",
        "mage": "(ﾉ>ω<)ﾉ :｡･:*:･ﾟ’★,｡･:*:･ﾟ’☆ Abracadabra! Lets be productive!",
        "bear": "ʕ •̀ ω •́ ʔ Keep going! You can bear it!",
        "allieB": "╰(°ロ°)╯ Do all the things!"
        }
    let slogan = randomProperty(slogans);
    // console.log(slogan);
    return <p> { slogan }</p>;

    	
    
  }
}

// Action Item - Put this function inside of the slogan class
var randomProperty = function (obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
};






// Render Home-Page Slogan
ReactDOM.render(
  (
  		<Slogan />
  ),
  document.getElementById('slogan'),
);

ReactDOM.render(
  (
  		<div>
	  		<Task task_msg=" Make a react component" task_id={40}/>
	  		<Task task_msg=" Make another one!" task_id={41}/>
  		</div>
  ),
  document.getElementById('task'),
);

// <JQueryWeatherAlert />
      // <WeatherAlert />


 