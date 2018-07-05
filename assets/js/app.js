//variables
const taskList = document.getElementById('task-list');




//Event Listeners
eventListeners();

function eventListeners() {
  //Form Submission
  document.querySelector('#form').addEventListener('submit', newTask);

}




//Functions
function newTask(e) {
  e.preventDefault();


  //Catch the Textarea value
  const task = document.getElementById('addtask').value;

  const li = document.createElement('li');
  li.textContent = task;
  taskList.appendChild(li);
}

