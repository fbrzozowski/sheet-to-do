import {default as App } from './App.js';

const tasks = JSON.parse(window.localStorage.getItem("tasks"));
const SheetToDo = new App(tasks);

SheetToDo.renderCardsWithTasks();
SheetToDo.startAddNoteEventListener();
setTimeout(() => {
    SheetToDo.startEventListener();
}, 400)