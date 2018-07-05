//variables
const taskList = document.getElementById('task-list');




//Event Listeners
eventListeners();

function eventListeners() {
  //Form Submission
  document.querySelector('#form').addEventListener('submit', newTask);

  //Remove tasks from TaskList
  taskList.addEventListener('click', removeTask);
}




//Functions
function newTask(e) {
  e.preventDefault();


  //Catch the Textarea value
  const task = document.getElementById('addtask').value;

  //Create the remove Button
  const removeBtn = document.createElement('a');
  removeBtn.classList = 'remove-task';
  removeBtn.textContent = 'X';


  //Create <li>
  const li = document.createElement('li');
  li.textContent = task;


  //add this button to each task
  li.appendChild(removeBtn);

  //add to the list
  taskList.appendChild(li);
}

//Remove the Tasks from the DOM

function removeTask(e) {
  if (e.target.classList.contains('remove-task')) {
    e.target.parentElement.remove();
  }
}

