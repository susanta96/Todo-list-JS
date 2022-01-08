import './style.css';
import { formatDistance } from 'date-fns';
//  indexedDB Connection 
(function() {

  // 'global' variable to store reference to the database
  var db, input;
  let taskList = document.getElementById('task-list');
  let checkList = document.getElementById('checked-list');

  databaseOpen(function() {
    input = document.getElementById('addtask');
    document.querySelector('#form').addEventListener('submit', onSubmit);
    taskList.addEventListener('click', clickToComplete);
    checkList.addEventListener('click', clickToDelete);
    databaseTodosGet(renderAllTodos);
  });

  function onSubmit(e) {
    e.preventDefault();
    if(input.value.trim() === ''){
      alert('Enter something to save task !!')
      return;
    }else {
      databaseTodosAdd(input.value, function() {
        databaseTodosGet(renderAllTodos);
        input.value = '';
      });
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

  function clickToComplete(e) {
    
    if (e.target.hasAttribute('id')) {
      databaseTodosUpdate(parseInt(e.target.getAttribute('id'), 10), function() {
        // Refresh the to-do list
        databaseTodosGet(renderAllTodos);
      });
    }else if(e.target.parentElement.hasAttribute('id')) {
       databaseTodosUpdate(parseInt(e.target.parentNode.getAttribute('id'), 10), function() {
        // Refresh the to-do list
        databaseTodosGet(renderAllTodos);
      });
    }
  }
  function clickToDelete(e) {
    if (e.target.hasAttribute('id')) {
      databaseTodosDelete(parseInt(e.target.getAttribute('id'), 10), function() {
        // Refresh the to-do list
        databaseTodosGet(renderAllTodos);
      });
    }else if(e.target.parentElement.hasAttribute('id')) {
       databaseTodosDelete(parseInt(e.target.parentNode.getAttribute('id'), 10), function() {
        // Refresh the to-do list
        databaseTodosGet(renderAllTodos);
      });
    }
  }

  function databaseTodosAdd(text, callback) {
    var transaction = db.transaction(['todo'], 'readwrite');
    var store = transaction.objectStore('todo');
    var request = store.put({
      text: text,
      completed: false,
      timeStamp: Date.now()
    });

    transaction.oncomplete = function(e) {
      callback();
    };
    request.onerror = databaseError;
  }


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
    var completedTodos = [];
    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
    
      // If there's data, add it to array
      if (result) {
        if(result.value.completed) {
          completedTodos.push(result.value);
        }else {
          data.push(result.value);
        }
        result.continue();

      // Reach the end of the data
      } else {
        callback(data, completedTodos);
      }
    };
  }

  function databaseTodosDelete(id, callback) {
    let transaction = db.transaction(['todo'], 'readwrite');
    let store = transaction.objectStore('todo');
    let request = store.delete(id);
    transaction.oncomplete = function(e) {
      callback();
    };
    request.onerror = databaseError;
  }

  function databaseTodosUpdate(id, callback) {
    let transaction = db.transaction(['todo'], 'readwrite');
    let store = transaction.objectStore('todo');
    //get the task data
    let task = store.get(id);
    
    transaction.oncomplete = function(e) {
      databaseUpdate(task.result, id, callback);
    };
    task.onerror = databaseError;

  }

  function databaseUpdate(todo, id, callback){
    let transaction = db.transaction(['todo'], 'readwrite');
    let store = transaction.objectStore('todo');

    let request = store.put({
      text: todo.text,
      completed: true,
      timeStamp: Date.now()
    });

    transaction.oncomplete = function(e) {
      databaseTodosDelete(id, callback)
    };
    request.onerror = databaseError;
  }

  function renderAllTodos(todos, completedTodos) {
    var html = '';
    todos.forEach(function(todo) {
      html += todoToHtml(todo);
    });
    taskList.innerHTML = html;

    var completed = '';
    completedTodos.forEach(function(todo) {
      completed += completedtodoToHtml(todo);
    })
    checkList.innerHTML = completed;
  }

  function todoToHtml(todo) {
    return '<li class="todo-item"><div class="round-box"></div><div><p class="todo-task">'+todo.text+'</p><span class="todo-time">' + 
    formatDistance(new Date(todo.timeStamp), new Date(), {addSuffix: true}) + '</span></div><button class="check-icon" id="' + todo.timeStamp + '"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button></li>';
  }

  function completedtodoToHtml(todo) {
    return '<li class="todo-item opacity-50"><div class="check-box"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><p class="todo-task line-through">'+todo.text+'</p><span class="todo-time line-through">' + 
    formatDistance(new Date(todo.timeStamp), new Date(), {addSuffix: true}) + '</span></div><button class="delete-icon" id="' + todo.timeStamp + '"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></li>';
  }

}());