import { format } from 'date-fns';
import { createToDo, projects, updateToDo, createProject, deleteTask, toggleCompletetion } from './taskManager';


const initialForm = document.querySelector('.initial-form')
const detailsForm = document.querySelector('.details-form')
const initialTitle = document.querySelector("#task")
const detailsTitle = document.querySelector("#title")
const initialDate = document.querySelector("form.initial-form > input[type=date]:nth-child(2)")
const detailsDate = document.querySelector("#due-date")
const detailsDesc = document.querySelector("#details")
const projectForm = document.querySelector(".create-project")

let currentTask
let currentProject 
let formMode = 'create'


// const selectEl = document.querySelector("#project-options")
const selectEl = document.querySelector("#project-options")

const tasksDiv = document.querySelector("#content > div.tasks-container > div > div")
const projectsUl = document.querySelector(".projects-ul")

//sets date to today by default in the initial form

function initialState(){
    displayAllTasks()
    displayProjects()
    setInitialDate()
}


function initializeEventListeners() {
    initialForm.addEventListener('submit', submitInitialForm);
    detailsForm.addEventListener('submit', handleDetailsFormSubmit);
    projectForm.addEventListener('submit', handleProjectForm)
    tasksDiv.addEventListener('click', openEditForm)
    tasksDiv.addEventListener('click', handleDelete)
    tasksDiv.addEventListener('click', handleCheck)
}


function setInitialDate(){
    const date = format(new Date, 'yyyy-MM-dd')
    initialDate.value = date
    return date
}


//function to display form for user to input task details
function submitInitialForm(e) {
    e.preventDefault();
    detailsTitle.value = initialTitle.value
    detailsDate.value = initialDate.value
    setFormMode("create")
    toggleDetailsVis()
    initialTitle.value = ''
}


function setFormMode(mode){
    formMode = mode
    const submitBtn = document.querySelector(".submit-det-btn")
    if (formMode === "edit"){
        submitBtn.innerText = "edit"
    } else if (formMode === "create"){
        submitBtn.innerText = "Submit"
    } else{
        console.log(mode)
    }
}




// creates a task with user input
function handleDetailsFormSubmit(e) {
    e.preventDefault();
    const title = detailsTitle.value;
    const date = detailsDate.value;
    const description = detailsDesc.value;
    const project = selectEl.value;

    if (formMode === 'create'){
        createTask(title, date, description, project);
        toggleDetailsVis();
    } 

    else if (formMode === 'edit'){
        editTask(currentTask, title, date, description, project)
        toggleDetailsVis();
    }
}

function createTask(title, date, description, project) {
    createToDo(title, date, description, project);
    displayAllTasks()
    displayProjects()
    setFormMode('undefined')
}

function editTask(currentTask, title, date, description, project){
    updateToDo(currentTask, title, date, description, project)
    displayAllTasks()
    displayProjects()
    setFormMode('undefined')
}



function handleCheck(evt){
    if (evt.target.closest('.task-check')){
        let clickedInfo = getClickedTask(evt)
        let task = clickedInfo.task
        toggleCompletetion(task)
        console.log("task marked complete")
        displayAllTasks()
        console.log(task)
    }
}


function openEditForm(evt) {
    if (evt.target.closest('.edit-svg')) { 
        let clickedTask = getClickedTask(evt)
        currentTask = clickedTask.task
        currentProject = clickedTask.project
        setFormMode("edit")
        toggleDetailsVis()
        disableInitialInputs(true)
        detailsTitle.value = currentTask.title
        selectEl.value = currentTask.project
        detailsDesc.value = currentTask.description
        detailsDate.value = currentTask.date
    }
}

function updatePrjctDropdown(){
    selectEl.innerHTML = ''
    projects.forEach(project => { 
        const newOption = document.createElement("option")
        newOption.innerText = project.name
        selectEl.appendChild(newOption)
    })
}


function handleDelete(evt){
    if (evt.target.classList.contains("delete-svg")){
        const clickedTask = getClickedTask(evt)
        const taskObj = clickedTask.task
        const parentProject = clickedTask.project
        deleteTask(taskObj, parentProject.name)
        displayAllTasks()
        displayProjects()
    }
}

function getClickedTask(evt) {
    const taskEl = evt.target.closest('.task');
    if (taskEl){
        const taskTitle = taskEl.getAttribute('data-task-title');
        const taskProject = taskEl.getAttribute('data-project-name');
        const project = projects.find(p => p.name === taskProject);
        const clickedTask = project.tasks.find(task => task.title === taskTitle)
        return {project: project, task: clickedTask }
    } else {
        console.log('Clicked task or project is undefined.');
    }
}



function toggleDetailsVis() {
    if (detailsForm.classList.contains('content-hidden')) {
            detailsForm.classList.replace('content-hidden', 'content-visible');
            disableInitialInputs(true)
            updatePrjctDropdown()
    } else {
            detailsForm.classList.replace('content-visible', 'content-hidden');
            disableInitialInputs(false)
            resetDetailsForm()
    }
}

function handleProjectForm(e){
    const titleInput = projectForm.querySelector('input[type="text"]');
    const projectName = titleInput.value
    e.preventDefault()
    createProject(projectName)
    titleInput.value = ''
    displayProjects()
}



function resetDetailsForm(){
    detailsTitle.value = ''
    detailsDate.value = ''
    detailsDesc.value = ''
}

function disableInitialInputs(bul){
    initialTitle.disabled = bul
    initialDate.disabled = bul
}

function displayProjects(){
    projectsUl.innerHTML = ''
    for (let project of projects){
        const projectLi = document.createElement('li')
        const a = document.createElement('a');
        a.href = '#'
        const pDefault = document.createElement('p');
        pDefault.textContent = project.name;
        const pCount = document.createElement('p');
        pCount.textContent = project.tasks.length;
        a.appendChild(pDefault);
        a.appendChild(pCount);
        projectLi.appendChild(a);
        projectsUl.appendChild(projectLi);
    }
}

function displayAllTasks(){
    tasksDiv.innerHTML = ''
    for (let project of projects){
        for (let task of project.tasks){
            const taskDiv = document.createElement("div")
            taskDiv.classList.add("task")
            taskDiv.setAttribute("data-project-name", project.name);
            taskDiv.setAttribute("data-task-title", task.title)
            const taskTitle = document.createElement("div")
            taskTitle.classList.add("task-title")
            const checkBoxEl = document.createElement("input")
            checkBoxEl.classList.add("task-check")
            checkBoxEl.setAttribute("type", "checkbox")
            checkBoxEl.checked = task.checked

            const titleText = document.createElement('p');
            titleText.innerText = task.title
            if (task.checked === true){
                titleText.classList.add('crossed-out')
            } else if(task.checked === false){
                titleText.classList.remove('crossed-out')
            }

            taskTitle.appendChild(checkBoxEl)
            taskTitle.appendChild(titleText)
            taskDiv.appendChild(taskTitle)
    
            const infoDiv = document.createElement('div');
            infoDiv.className = 'task-info';
            // create delete button
            const deleteLink = document.createElement('a');
            deleteLink.href = '#';
            deleteLink.innerHTML = '<svg class="delete-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>trash-can-outline</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>'; 
            infoDiv.appendChild(deleteLink);

            // create edit button
            const editLink = document.createElement('a');
            editLink.href = '#';
            editLink.innerHTML = '<svg class="edit-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>note-edit-outline</title><path d="M18.13 12L19.39 10.74C19.83 10.3 20.39 10.06 21 10V9L15 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11V19.13L11.13 19H5V5H12V12H18.13M14 4.5L19.5 10H14V4.5M19.13 13.83L21.17 15.87L15.04 22H13V19.96L19.13 13.83M22.85 14.19L21.87 15.17L19.83 13.13L20.81 12.15C21 11.95 21.33 11.95 21.53 12.15L22.85 13.47C23.05 13.67 23.05 14 22.85 14.19Z" /></svg>'; 
            
            infoDiv.appendChild(editLink);
            // create task
            const taskDate = document.createElement('p');
            taskDate.className = 'task-date';
            taskDate.textContent = task.date; 
            infoDiv.appendChild(taskDate);
            taskDiv.appendChild(infoDiv);
            tasksDiv.appendChild(taskDiv)
            }
        }
}


export {submitInitialForm, initialState, displayAllTasks, displayProjects, initializeEventListeners}
