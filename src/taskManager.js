
const weekTasks = []
const allTasks = []

const projects = [
    {
        name: "Default",
        tasks: [ ]
    }
]

let allTasksCount = 0



// creates a task, assigns it to a project
function createToDo(title, date, description, projectName){
    const task = {
        title: title,
        date: date,
        description: description,
        project: projectName,
        checked: false
    }
    allTasksCount++
    pushTaskToProject(task, projectName)
}




function pushTaskToProject(task, destProjectName){
    let proj = projects.find(p => p.name === destProjectName)
    proj.tasks.push(task)
    console.log('pushed task to project')
}


function deleteTask(task, projectName){
    let proj = projects.find(p => p.name === projectName)
    if (!proj) {
        console.error('Project not found:', projectName);
        return; // Exit the function if the project is not found
    }
    let tasksArray = proj.tasks
    let index = tasksArray.indexOf(task)
    proj.tasks.splice(index, 1)
    console.log("deleted task successfully")
    return task
}


function toggleCompletetion(task){
    if (task.checked === false){
        task.checked = true
    } else if (task.checked === true){
        task.checked = false
    }
}



function updateToDo(task, newTitle, newDate, newDesc, newProjName){
    task.title = newTitle
    task.date = newDate
    task.description = newDesc
    let curProj = projects.find(p => p.name === task.project)

    if (curProj.name !== newProjName){
        console.log('changing project')
        let taskToMove = deleteTask(task, curProj.name)
        let destinationProj = projects.find(p => p.name === newProj)
        task.project = newProj
        destinationProj.tasks.push(taskToMove)
    } else{
        console.log('same project')
    }
}



function createProject(title){
    const project = {name: title, tasks: []}    
    projects.push(project)
}







export {createToDo, projects, createProject, updateToDo, deleteTask, toggleCompletetion}
