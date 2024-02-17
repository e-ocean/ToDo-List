import { getTime } from "date-fns";


let storedProjects 


function updateStoredProjects() {
    localStorage.setItem('projects', JSON.stringify(storedProjects)); 
}

function getStorageProjects(){
    const projectsData = localStorage.getItem('projects');
    if(projectsData){
        const projectsData = localStorage.getItem('projects');
        storedProjects = JSON.parse(projectsData)
        return storedProjects
    }
    else{
        storedProjects = [{
            name: "Default",
            tasks: [ ]
        }]
        return storedProjects
    } 
}



const weekTasks = []
const allTasks = []



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
    updateStoredProjects()
}






function pushTaskToProject(task, destProjectName){
    let proj = storedProjects.find(p => p.name === destProjectName)
    proj.tasks.push(task)
    console.log('pushed task to project')
}


function deleteTask(task, projectName){
    let proj = storedProjects.find(p => p.name === projectName)
    if (!proj) {
        console.error('Project not found:', projectName);
        return; // Exit the function if the project is not found
    }
    let tasksArray = proj.tasks
    let index = tasksArray.indexOf(task)
    proj.tasks.splice(index, 1)
    console.log("deleted task successfully")
    updateStoredProjects()
    return task
}


function toggleCompletetion(task){
    if (task.checked === false){
        task.checked = true
        updateStoredProjects()
    } else if (task.checked === true){
        task.checked = false
        updateStoredProjects()
    }
}



function updateToDo(task, newTitle, newDate, newDesc, newProjName){
    task.title = newTitle
    task.date = newDate
    task.description = newDesc
    updateStoredProjects()
    let curProj = storedProjects.find(p => p.name === task.project)

    if (curProj.name !== newProjName){
        console.log('changing project')
        let taskToMove = deleteTask(task, curProj.name)
        let destinationProj = storedProjects.find(p => p.name === newProj)
        task.project = newProj
        destinationProj.tasks.push(taskToMove)
        updateStoredProjects()
    } else{
        console.log('same project')
    }
}



function createProject(title){
    const project = {name: title, tasks: []}    
    storedProjects.push(project)
    updateStoredProjects()
}







export {createToDo, getStorageProjects, createProject, updateToDo, deleteTask, toggleCompletetion}
