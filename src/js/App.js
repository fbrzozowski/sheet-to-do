import { default as EventListener } from './EventListener.js';
import { default as Task } from './Task.js';

export default class App {

    constructor(tasks) {
        this.eventHandler = new EventListener(this);
        this.appStorage = window.localStorage;
        this.initializeTasksFromLocalStorage(tasks);
    }

    initializeTasksFromLocalStorage(tasks) {
        if (tasks == null) {
            this.tasks = [new Task(undefined,
                "Hello World!!!",
                "<p>To <strong>add new note</strong> click 'new note' at the top of the page.</p>" +
                "<p>To <strong>edit title/description</strong> just double click on the text.</p>" +
                "You can also <strong>delete & change cards' color</strong> by click the icon at the top right corner."
            )];
        } else {
            this.tasks = [];
            tasks.forEach((task) => {
                var note = new Task(Task.incrementId(), task.name, task.description, task.color);
                this.tasks.push(note);
            });
        }
    }

    startEventListener() {
        this.eventHandler.start();
    }

    startAddNoteEventListener() {
        this.eventHandler.startOnce();
    }

    getStorage() {
        return this.appStorage;
    }

    changeTaskCardColor(id, newColor) {
        var task = this.getTask(id);
        task.color = newColor;

        this.renderCardsWithTasks();
        this.startEventListener();

        this.appStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderCardsWithTasks() {
        var container_block = document.getElementById('tasks');

        if (this.tasks.length == 0) {
            container_block.innerHTML = "<h3>No tasks! Please add some. :)</h3>";
        } else {
            container_block.innerHTML = "";
        }

        this.tasks.forEach(task => {
            var card = task.generateCard()
            container_block.appendChild(card);
        });
    }

    addTask(task) {
        this.tasks.push(task);
    }

    getTask(id) {
        return this.tasks.find(task => task.id == id);
    }


    editTaskData(id, container) {
        var taskCard = document.getElementById(id);
        var description = taskCard.querySelector(container);
        description.contentEditable = true;
    }

    saveTaskData(id, constainer) {
        var taskCard = document.getElementById(id);
        var dataContainer = taskCard.querySelector(constainer);
        var task = this.getTask(id);
        (constainer == '.title') ? task.name = dataContainer.innerHTML: task.description = dataContainer.innerHTML;
        this.appStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addNewNote() {
        var name = document.getElementById("modal-title-input");
        var description = document.getElementById("modal-description-input");

        this.tasks.push(new Task(Task.incrementId(), name.value, description.value));
        this.appStorage.setItem('tasks', JSON.stringify(this.tasks));

        this.renderCardsWithTasks();
        this.startEventListener();

        setTimeout(() => {
            name.value = "";
            description.value = "";
        }, 400)
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(item => item.id != id);
        this.appStorage.setItem('tasks', JSON.stringify(this.tasks));

        this.renderCardsWithTasks();
        this.startEventListener();
    }

    parseToMarkdown() { //WTF nazwa?
        var allDescriptions = document.getElementsByClassName("subtitle");
        var reader = new commonmark.Parser({ smart: true });
        var writer = new commonmark.HtmlRenderer({ sourcepos: true, softbreak: "<br />" });

        for (var i = 0; i < allDescriptions.length; i++) {
            var description = allDescriptions[i];
            var parsed = reader.parse(description.innerHTML); // parsed is a 'Node' tree
            description.innerHTML = writer.render(parsed);
        }
    }
}