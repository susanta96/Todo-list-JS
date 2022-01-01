import './style.css';
import { formatDistance, subDays } from 'date-fns';
//  indexedDB Connection 
(function() {

  // 'global' variable to store reference to the database
  var db, input;
  let taskList = document.getElementById('task-list');
  let checkList = document.getElementById('checked-list');

  databaseOpen(function() {
    input = document.getElementById('addtask');
    document.querySelector('#form').addEventListener('submit', onSubmit);
    databaseTodosGet(renderAllTodos);
  });

  function onSubmit(e) {
    e.preventDefault();
    if(input.value.trim() === ''){
      alert('Enter something to save task !!')
      return;
    }else {
      databaseTodosAdd(input.value, function() {
        input.value = '';
      });
      databaseTodosGet(renderAllTodos);
    }
  }

  function databaseOpen(callback) {
    // Open a database, specify the name and version
    var version = 1;
    var request = indexedDB.open('todos', version);

    // Run migrations if necessary
    request.onupgradeneeded = function(e) {
      db = e.target.result;
      e.target.transaction.onerror = databaseError;
      db.createObjectStore('todo', { keyPath: 'timeStamp' });
    };

    request.onsuccess = function(e) {
      db = e.target.result;
      callback();
    };
    request.onerror = databaseError;
  }

  function databaseError(e) {
    console.error('An IndexedDB error has occurred', e);
  }

  function databaseTodosAdd(text, callback) {
    var transaction = db.transaction(['todo'], 'readwrite');
    var store = transaction.objectStore('todo');
    var request = store.put({
      text: text,
      timeStamp: Date.now()
    });

    transaction.oncomplete = function(e) {
      callback();
    };
    request.onerror = databaseError;
  }

      //Create the checked button
      // const checkBtn = document.createElement('a');
      // checkBtn.classList = 'checked-task';
      // checkBtn.textContent = '✓';
    
      // //Create the remove Button
      // const removeBtn = document.createElement('a');
      // removeBtn.classList = 'remove-task';
      // removeBtn.textContent = 'X';
    
    
      // //Create <li>
      // const li = document.createElement('li');
      // li.textContent = task;
    
    
      // //add this button to each task
      // li.appendChild(removeBtn);
      // //add checked button to each task
      // li.appendChild(checkBtn);
    
      // //add to the list
      // taskList.appendChild(li);

  function databaseTodosGet(callback) {
    var transaction = db.transaction(['todo'], 'readonly');
    var store = transaction.objectStore('todo');

    // Get everything in the store
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store.openCursor(keyRange);

    // This fires once per row in the store. So, for simplicity,
    // collect the data in an array (data), and pass it in the
    // callback in one go.
    var data = [];
    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;

      // If there's data, add it to array
      if (result) {
        data.push(result.value);
        result.continue();

      // Reach the end of the data
      } else {
        callback(data);
      }
    };
  }

  function renderAllTodos(todos) {
    var html = '';
    todos.forEach(function(todo) {
      html += todoToHtml(todo);
    });
    taskList.innerHTML = html;
  }

  function todoToHtml(todo) {
    return '<li class="todo-item"><div class="round-box"></div><div><p class="todo-task">'+todo.text+'</p><span class="todo-time">' + 
    formatDistance(new Date(todo.timeStamp), new Date(), {addSuffix: true}) + '</span></div></li>';
  }

}());







// //Event Listeners
// eventListeners();

// function eventListeners() {
//   //Form Submission
//   document.querySelector('#form').addEventListener('submit', newTask);

//   //Remove tasks from TaskList
//   taskList.addEventListener('click', completeTask);

//   //Remove tasks from TaskList
//   taskList.addEventListener('click', removeTask);

//   //Document
//   document.addEventListener('DOMContentLoaded', localStorageOnLoad);
// }




// //Functions


// //Remove the Tasks from the DOM

// function removeTask(e) {
//   if (e.target.classList.contains('remove-task')) {
//     e.target.parentElement.remove();
//   }

//   //Remove from Storage 
//   removeTaskLocalStorage(e.target.parentElement.textContent);
// }

// function addTaskLocalStorage(task) {
//   let tasks = getTaskFromStorage();

//   //add the tasks into array
//   tasks.push(task);

//   //Convert Task array intostring
//   localStorage.setItem('tasks', JSON.stringify(tasks));
// }

// function getTaskFromStorage() {
//   let tasks;
//   const tasksLS = localStorage.getItem('tasks');
//   //Get the value, if null is return then create an empty array
//   if (tasksLS === null) {
//     tasks = [];
//   } else {
//     tasks = JSON.parse(tasksLS);
//   }
//   return tasks;
// }

// //Print LocalStorage Tasks On Load
// function localStorageOnLoad() {
//   let tasks = getTaskFromStorage();

//   //Loop through Each task and Print them on li
//   tasks.forEach(function (task) {
//     //Create the checked button
//     const checkBtn = document.createElement('a');
//     checkBtn.classList = 'checked-task';
//     checkBtn.textContent = '✓';

//     //Create the remove Button
//     const removeBtn = document.createElement('a');
//     removeBtn.classList = 'remove-task';
//     removeBtn.textContent = 'X';


//     //Create <li>
//     const li = document.createElement('li');
//     li.textContent = task;

//     //add this button to each task
//     li.appendChild(removeBtn);
//     //add checked button to each task
//     li.appendChild(checkBtn);

//     //add to the list
//     taskList.appendChild(li);
//   });
// }

// //Remove the Task from Local Storage

// function removeTaskLocalStorage(task) {
//   //Get Tasks from storage
//   let tasks = getTaskFromStorage();

//   //Remove the X from the remove button

//   const taskDelete = task.substring(0, task.length - 1);
//   // console.log(taskDelete);

//   //Look through the all tasks & delete them
//   tasks.forEach(function (taskLS, index) {
//     if (taskDelete === taskLS) {
//       tasks.splice(index, 1);
//     }
//   });

//   //Save the new array data to Local Storage
//   localStorage.setItem('tasks', JSON.stringify(tasks));

// }

// function completeTask(e) {
//   if (e.target.classList.contains('checked-task')) {
//     let taskText = e.target.parentElement.textContent;
//     let taskDone = taskText.substring(0, taskText.length - 2);
//     // console.log(taskDone);
//     //Create the remove Button
//     const removeBtn = document.createElement('a');
//     removeBtn.classList = 'remove-task';
//     removeBtn.textContent = 'X';


//     //Create <li>
//     const li = document.createElement('li');
//     li.textContent = taskDone;

//     //add this button to each task
//     li.appendChild(removeBtn);


//     //add to the list
//     checkList.appendChild(li);
//     checkList.classList ='complete-task';

//     //remove from todo list
//     e.target.parentElement.remove();

//     //Remove from Storage 
//     removeTaskLocalStorage(e.target.parentElement.textContent);

//   }
// }