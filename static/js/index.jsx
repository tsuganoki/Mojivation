"use strict";


class Task extends React.Component {

	render() {
		return (
			<form action="/complete-task" method="POST">
		        <input hidden name="task_id" value="20" />
		      
		        <input type="submit" name="complete" value="Done" />
		        <a class="task-msg" 
		           href="/edit_task/20"> 
		            Make a Task Component
		        </a>

		        <a href="/delete-task-20">
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
	alertMe () {
		console.log("ALART")
	}

  
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



class App extends React.Component {
	render () {
		return [
				<div>
			    	<Slogan />
			    	<Task />
		    	</div>
		]
	}
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
  		<Task />
  ),
  document.getElementById('task'),
);

// <JQueryWeatherAlert />
      // <WeatherAlert />


 