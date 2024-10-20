const API_URL = 'http://localhost:3001';

// Fetch existing todos when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    //load all the todos in the DOM.
    const arrayOfTasks = await fetchTodos();
    renderAllTasks(arrayOfTasks);
    console.log(arrayOfTasks);
});
function renderAllTasks(arrayOfTasks){
    const toDoListHTML = document.getElementById('todo-list');
    toDoListHTML.innerHTML = '';
    arrayOfTasks.forEach(element => {
        addTodoToDOM(element);
    })

    toDoListHTML.addEventListener('click', async(event)=>{
        if(event.target.closest('.delete-button')){
            const eventClosest = event.target.closest('.delete-button');
            eventClosest.parentElement.remove();
            const idClassName = eventClosest.classList[1];
            const id = idClassName.split('-')[1];
            await deleteTodo(id);
        }

        if(event.target.closest('.completed-button')){
            const completedButton = event.target.closest('.completed-button');
            const taskCompletedHeading = completedButton.previousElementSibling.querySelector('p').textContent;
            const idCompletedTask = completedButton.classList[1].split('-')[1];
            await toggleTodo(idCompletedTask, true, taskCompletedHeading);
            addTodoToDOM({id: idCompletedTask, taskHeading: taskCompletedHeading, completed: true});
            completedButton.parentElement.remove();
        }

        if(event.target.closest('.reject-changes-button')){
            // const rejectButton = event.target.closest('.reject-changes-button');
            // renderAllTasks(arrayOfTasks);
            //get the id of the cancel button.
            const id = parseInt(event.target.closest('.reject-changes-button').parentElement.classList[1].split('-')[1]);
            //Get the content from the arrayOftasks by using filter.
            const task = arrayOfTasks.find(task => task.id === id);
            console.log(task);
            //remove the whole task
            const parentElement = event.target.closest('.reject-changes-button').parentElement;
            parentElement.remove();
            // render the task
            addTodoToDOM(task);
        }

        if(event.target.closest('.save-changes-button')){
            const saveChangesButton = event.target.closest('.save-changes-button');
            // get the updated text.
            const newText = saveChangesButton.parentElement.querySelector('textarea').value;

            // and id
            const idOfUpdatedText  = saveChangesButton.parentElement.classList[1].split('-')[1];

            // remove the previous textAreatextContent
            saveChangesButton.parentElement.remove();

            // Render back the task using the updated text and previous original id. Also add the updated changes to the backend.
            try{
                await axios.put(`${API_URL}` +`/todos/${idOfUpdatedText}`,{
                    id : idOfUpdatedText, 
                    taskHeading : newText,
                    completed : false
                })
            }catch(error){
                console.error('Error toggling todo:', error);
            }
            //Add the updated to do to the DOM.
            addTodoToDOM({id: idOfUpdatedText, taskHeading: newText, completed: false});
        }
        if(event.target.closest('.edit-button')){
            const editButtonHTML = event.target.closest(('.edit-button'));
            renderEditBlock(editButtonHTML.parentElement);
        }
    })

    const completedTasksHTML= document.querySelector('.completedTasks');
    // completedTasksHTML.innerHTML = '';
    completedTasksHTML.addEventListener('click', async (event)=>{
        if(event.target.closest('.toggle-button')){
            const toggleButton = event.target.closest('.toggle-button');
            id = toggleButton.classList[1].split('-')[1];
            content = toggleButton.previousElementSibling.querySelector('p').textContent;

            await toggleTodo(id, false, content);
            // const arrayUpdated = await fetchTodos();
            // console.log(arrayUpdated); 
            addTodoToDOM({id: id, taskHeading: content, completed: false});
            toggleButton.parentElement.remove();
        }   
    })

}

// Fetch todos from backend
async function fetchTodos() {
    try {
        const todoResponse = await axios.get(`${API_URL}/todos`);
        const arrayOfTasks = todoResponse.data;
        return arrayOfTasks;
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
}

// Add a new todo to the DOM
function addTodoToDOM(todo) {
    // 1) Add checks for whether the taskes to be added is to be added to the 1) To Do or 2) Completed?
    if(todo.completed == false){
        const toDoListHTML = document.getElementById('todo-list');
        toDoListHTML.innerHTML += 
        `   
            <div class = "todo-list-item-container item-${todo.id}">    
                <li id = 'todo-list-task-container'><p>${todo.taskHeading}</p></li>
                <button class = "completed-button id-${todo.id}" id="completed-to-do">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                </button>
                <button class= "delete-button id-${todo.id}" id="delete-to-do">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>
                </button>

                <button class= "edit-button id-${todo.id}" id="edit-to-do">
                    <svg
                         xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                    </svg>
                </button>
            </div>
        `
    }
    else{
        const completedTasksHTML = document.querySelector('.completedTasks');
        completedTasksHTML.innerHTML += 
        `
            <div class = "todo-list-item-container item-${todo.id}">    
                <li id ="completed-list"><p>${todo.taskHeading}</p></li>
                <button class = "toggle-button id-${todo.id}" id="toggleButton">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-repeat-2"><path d="m2 9 3-3 3 3"/><path d="M13 18H7a2 2 0 0 1-2-2V6"/><path d="m22 15-3 3-3-3"/><path d="M11 6h6a2 2 0 0 1 2 2v10"/></svg>
                </button> 
            </div>
        `
    }
}
//render the edit block for a task 
//remove the li element
//
function renderEditBlock(toEditHTML){
    console.log(toEditHTML);
    //select all the three boxes, remove them and then also add them once they are done
    //1. Select the tick
    const tickButton = toEditHTML.querySelector('.completed-button');
    //2. Select the deleteButton
    const deleteButton = toEditHTML.querySelector('.delete-button');
    //3. select the tick button 
    const editButton = toEditHTML.querySelector('.edit-button');

    console.log(deleteButton);
    const pElement = toEditHTML.querySelector('p');
    const id = toEditHTML.querySelector('.edit-button').classList[1].split('-')[1]; 
    console.log(id);
    
    const content =  pElement.textContent;
    console.log(content);

    pElement.remove();
    const boxHTML = toEditHTML.querySelector('li'); 
    toEditHTML.classList.add("edit-box-parent");
    boxHTML.innerHTML = `
        <div class ="edit-task-container">
            <textarea style="width: 100%; resize: none;" class= "edit-task id-${id}" type="text">${content}</textarea>
        </div>
    `
    tickButton.remove();
    deleteButton.remove();
    editButton.remove();

    toEditHTML.innerHTML +=
    `
        <button class = "reject-changes-button id-${id}" id="reject-changes">
            <svg 
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>
            </svg>
        </button>

        <button class = "save-changes-button id-${id}" id="save-changes">
            <svg 
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/>
            </svg>
        </button>

    `
    console.log("This is the updated toEditHTML", toEditHTML);
}

// Add a new todo
document.getElementById('add-todo-btn').addEventListener('click', async() => {
    const newTaskHeading = document.getElementById('todo-input').value;
    if(newTaskHeading){
        document.getElementById('todo-input').value ="";
        await axios.post(`${API_URL}`+"/todos",{
            taskHeading: newTaskHeading
        }).then(function (response) {
            const newTask = {
                id: response.data.id,
                taskHeading : response.data.taskHeading,
                completed: false
            }
            addTodoToDOM(newTask);
        })
    }
    else{
        alert("No task heading entered.");
    }
   
});

// Toggle todo completion
async function toggleTodo(id, completed, taskCompletedHeading) {
    try{
        await axios.put(`${API_URL}` +`/todos/${id}`,{
            id : id, 
            taskHeading : taskCompletedHeading,
            completed : completed
        })
    }catch(error){
        console.error('Error toggling todo:', error);
    }
}


// Delete a todo
async function deleteTodo(id) {
    try {
        await axios.delete(`${API_URL}/todos/${id}`);
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}
