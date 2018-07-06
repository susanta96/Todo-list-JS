//variables
const taskList = document.getElementById('task-list');
const checkList = document.getElementById('checked-list');



//Event Listeners
eventListeners();

function eventListeners() {
  //Form Submission
  document.querySelector('#form').addEventListener('submit', newTask);

  //Remove tasks from TaskList
  taskList.addEventListener('click', completeTask);

  //Remove tasks from TaskList
  taskList.addEventListener('click', removeTask);

  //Document
  document.addEventListener('DOMContentLoaded', localStorageOnLoad);
}




//Functions
function newTask(e) {
  e.preventDefault();


  //Catch the Textarea value
  const task = document.getElementById('addtask').value;

  //Create the checked button
  const checkBtn = document.createElement('a');
  checkBtn.classList = 'checked-task';
  checkBtn.textContent = '✓';

  //Create the remove Button
  const removeBtn = document.createElement('a');
  removeBtn.classList = 'remove-task';
  removeBtn.textContent = 'X';


  //Create <li>
  const li = document.createElement('li');
  li.textContent = task;


  //add this button to each task
  li.appendChild(removeBtn);
  //add checked button to each task
  li.appendChild(checkBtn);

  //add to the list
  taskList.appendChild(li);

  //call add tasks to local storage
  addTaskLocalStorage(task);

  //Print aleart
  alert('Task added!');

  this.reset();
}

//Remove the Tasks from the DOM

function removeTask(e) {
  if (e.target.classList.contains('remove-task')) {
    e.target.parentElement.remove();
  }

  //Remove from Storage 
  removeTaskLocalStorage(e.target.parentElement.textContent);
}

function addTaskLocalStorage(task) {
  let tasks = getTaskFromStorage();

  //add the tasks into array
  tasks.push(task);

  //Convert Task array intostring
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTaskFromStorage() {
  let tasks;
  const tasksLS = localStorage.getItem('tasks');
  //Get the value, if null is return then create an empty array
  if (tasksLS === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(tasksLS);
  }
  return tasks;
}

//Print LocalStorage Tasks On Load
function localStorageOnLoad() {
  let tasks = getTaskFromStorage();

  //Loop through Each task and Print them on li
  tasks.forEach(function (task) {
    //Create the checked button
    const checkBtn = document.createElement('a');
    checkBtn.classList = 'checked-task';
    checkBtn.textContent = '✓';

    //Create the remove Button
    const removeBtn = document.createElement('a');
    removeBtn.classList = 'remove-task';
    removeBtn.textContent = 'X';


    //Create <li>
    const li = document.createElement('li');
    li.textContent = task;

    //add this button to each task
    li.appendChild(removeBtn);
    //add checked button to each task
    li.appendChild(checkBtn);

    //add to the list
    taskList.appendChild(li);
  });
}

//Remove the Task from Local Storage

function removeTaskLocalStorage(task) {
  //Get Tasks from storage
  let tasks = getTaskFromStorage();

  //Remove the X from the remove button

  const taskDelete = task.substring(0, task.length - 1);
  // console.log(taskDelete);

  //Look through the all tasks & delete them
  tasks.forEach(function (taskLS, index) {
    if (taskDelete === taskLS) {
      tasks.splice(index, 1);
    }
  });

  //Save the new array data to Local Storage
  localStorage.setItem('tasks', JSON.stringify(tasks));

}

function completeTask(e) {
  if (e.target.classList.contains('checked-task')) {
    let taskText = e.target.parentElement.textContent;
    let taskDone = taskText.substring(0, taskText.length - 2);
    // console.log(taskDone);
    //Create the remove Button
    const removeBtn = document.createElement('a');
    removeBtn.classList = 'remove-task';
    removeBtn.textContent = 'X';


    //Create <li>
    const li = document.createElement('li');
    li.textContent = taskDone;

    //add this button to each task
    li.appendChild(removeBtn);


    //add to the list
    checkList.appendChild(li);
    checkList.classList ='complete-task';

    //remove from todo list
    e.target.parentElement.remove();

    //Remove from Storage 
    removeTaskLocalStorage(e.target.parentElement.textContent);

  }
}