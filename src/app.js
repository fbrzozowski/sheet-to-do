"use strict";

class App {
    constructor(tasks) {
        this.eventHandler = new EventListener(this);
        this.appStorage = window.localStorage;
        this.initializeTasksFromLocalStorage(tasks);
    }

    initializeTasksFromLocalStorage(tasks) {
        if (tasks == null) {
            this.tasks = [new Task(undefined,
                "Hello user!!!",
                "To add new note click 'new note' at the top of the page." +
                "To edit title/description just double click on the text. ;)"
            )];
        } else {
            this.tasks = [];
            tasks.forEach((task) => {
                var note = new Task(Task.incrementId(), task.name, task.description);
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

    getTasks() {
        return this.tasks;
    }

    getTask(id) {
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id == id) {
                return this.tasks[i];
            }
        }
        return null;
    }

    editTaskName(id) {
        var card = document.getElementById(id).childNodes;
        card[1].style.display = "none";
        var input = card[5];
        input.setAttribute("type", "text");
        input.focus();
        input.setAttribute("value", card[1].innerHTML);
    }

    saveTitle(id) {
        var card = document.getElementById(id).childNodes;
        var title = card[1];
        title.style.display = "";
        var input = card[5];
        input.setAttribute("type", "hidden");
        title.innerHTML = input.value;
        var task = this.getTask(id);
        task.setName(input.value);
        this.appStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    editDescription(id) {
        // var converter = new showdown.Converter();
        var card = document.getElementById(id).childNodes;
        console.log(card);
        var description = card[7];
        var input = card[9];

        description.classList.add("hidden");
        input.classList.remove("hidden");
        var task = this.getTask(id);
        input.focus();
        input.innerHTML = task.getDescription();
        // input.innerHTML = converter.stripHtml(description.innerHTML);
    }

    saveEditDescription(id) {
        var card = document.getElementById(id).childNodes;
        var description = card[7];
        var input = card[9];
        var task = this.getTask(id);
        input.classList.add("hidden");
        task.setDescription(input.value);
        description.innerHTML = input.value;
        description.classList.remove("hidden");
        this.appStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.toMarkdownParser();
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

    toMarkdownParser() {
        var allDescriptions = document.getElementsByClassName("subtitle");
        var reader = new commonmark.Parser({smart: true});
        var writer = new commonmark.HtmlRenderer({sourcepos: true, softbreak: "<br />"});

        for (var i = 0; i < allDescriptions.length; i++) {
            var description = allDescriptions[i];
            var parsed = reader.parse(description.innerHTML); // parsed is a 'Node' tree
            description.innerHTML = writer.render(parsed);
        }
    }
}

class Task {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.color = 'has-background-info';
    }

    setColor(color) {
        // has-background-dark 
        // has-background-primary
        // has-background-info
        // has-background-link
        // has-background-success
        // has-background-warning
        // has-background-danger
        this.color = color;
    }

    getColor() {
        return this.color;
    }

    static incrementId() {
        if (!this.latestId) {
            this.latestId = 1;
        } else {
            this.latestId++;
        }
        return this.latestId;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setDescription(description) {
        this.description = description;
    }

    getDescription() {
        return this.description;
    }

    generateCard() {
        var card = this.htmlToElement(
            `<div class="flex tile is-parent is-vertical">
                <article id="${ this.id }" class="article tile is-child ${ this.color } notification is-primary">
                  <p class="title">${ this.name }</p>
                  <span class="remove"><i class="fas fa-trash fa-lg"></i></span>
                  <input type="hidden" class="title stkv-o-text-input"/>
                  <p class="subtitle">${ this.description }</p>
                  <textarea class="hidden title stkv-o-text-input small-font h-100"></textarea>
                </article>
            </div>`
        );
        return card;
    }

    htmlToElement(html) {
        var template = document.createElement('template');
        // html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }
}

class EventListener {
    constructor(app) {
        this.app = app;
    }

    editTitleListener() {
        var elementsArray = document.getElementsByClassName('article');
        for (var i = 0; i < elementsArray.length; i++) {
            elementsArray[i].childNodes[1].addEventListener("dblclick", (e) => {
                var id = e.target.parentNode.id;
                this.app.editTaskName(id);
            });
            elementsArray[i].childNodes[5].addEventListener("focusout", (e) => {
                var id = e.target.parentNode.id;
                this.app.saveTitle(id);
            });
        }
    }

    addNewTaskModalOpen() {
        document.querySelector('a#open-modal').addEventListener('click', (e) => {
            e.preventDefault();
            var modal = document.querySelector('.modal'); // assuming you have only 1
            var html = document.querySelector('html');
            modal.classList.add('is-active');
            html.classList.add('is-clipped');

            modal.querySelector('.modal-background').addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.remove('is-active');
                html.classList.remove('is-clipped');
            });

            modal.querySelector("#save-task").addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.remove('is-active');
                html.classList.remove('is-clipped');
            });
        });
    }

    removeNoteButtonListener() {
        var elementsArray = document.getElementsByClassName('remove');
        for (var i = 0; i < elementsArray.length; i++) {
            elementsArray[i].addEventListener("click", (e) => {
                var id = e.target.parentNode.parentNode.parentNode.id;
                this.app.removeTask(id);
            });
        }
    }


    editDescriptionListener() {
        var elementsArray = document.getElementsByClassName('subtitle');
        for (var i = 0; i < elementsArray.length; i++) {
            elementsArray[i].addEventListener("dblclick", (e) => {
                var id = e.target.closest('article').id;
                this.app.editDescription(id);
            }, true);
        }
        var elementsArrayInput = document.getElementsByClassName('stkv-o-text-input');
        for (var i = 0; i < elementsArrayInput.length; i++) {
            elementsArrayInput[i].addEventListener("focusout", (e) => {
                var id = e.target.parentNode.id;
                this.app.saveEditDescription(id);
            }, true);
        }
    }


    saveNewTaskFromModal() {
        var saveNoteButton = document.getElementById("save-task");
        saveNoteButton.addEventListener("click", (e) => {
            this.app.addNewNote();
        });
    }

    start() {
        this.app.toMarkdownParser();
        this.removeNoteButtonListener();
        this.editTitleListener();
        this.addNewTaskModalOpen();
        this.editDescriptionListener();
    }
    startOnce() {
        this.saveNewTaskFromModal();
    }
}

// window.onload = () => {
var tasks = JSON.parse(window.localStorage.getItem("tasks"));
const app = new App(tasks);

app.renderCardsWithTasks();
app.startAddNoteEventListener();
setTimeout(() => {
    app.startEventListener();
}, 400)
// };