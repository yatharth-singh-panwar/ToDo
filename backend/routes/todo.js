let todos = [];
let globalId = 0;

async function getAllTodo (req, res, next){
    try{
        res.status(200).send(todos);
        next();
    }
    catch (error) {
        res.status(500).send({
            msg: "Error occurred",
            error: error.message
        });
    }
}

async function createTodo(req, res, next){
    const taskHeading = req.body.taskHeading;

    if(taskHeading){
        globalId += 1;
        const newToDo = {id: globalId, taskHeading: taskHeading, completed : false};
        todos.push(newToDo);
        res.status(200).send(newToDo);
        next();
    } 
    else{
        res.status(500).send({
            "msg" : "failed adding new task, no taskHeading sent."
        })
    }
}

async function updateTodo (req, res, next){
    const id = parseInt(req.params.id);
    
    const objToUpdate = todos.find(task => task.id === id);
    if(objToUpdate){
        const newHeading  = req.body.taskHeading;
        if(newHeading){
            objToUpdate.taskHeading = newHeading;
            if(req.body.completed !== undefined){
                objToUpdate.completed = req.body.completed;
            }
            res.status(200).send({
                msg: "Task successfully updated.",
                updatedTask: objToUpdate,
            });
            next();
        }
        else{
            res.status(400).send({
                msg:"Could not find new Heading for the task."
            })
        }
    }
    else{
        res.status(400).send({
            msg: "Object could not be found."
        })
    }
}

async function deleteTodo (req, res, next){}

async function deleteTodoById (req, res, next){
    const id = parseInt(req.params.id);
    const taskIndex = todos.findIndex(task => task.id === id);
    if(taskIndex !== -1){
        todos.splice(taskIndex, 1);
        res.status(200).send({
            msg: "Task successfully deleted."
        });
        next();
    }
    else{
        res.status(400).send({
            msg : "The object with the id could not be found."
        })
    }
}
module.exports = {
    getAllTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    deleteTodoById,
};