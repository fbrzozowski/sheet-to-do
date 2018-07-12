"use strict";

class App {
    constructor(tasks) {
        this.eventHandler = new EventHandler(this);
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
        var card = document.getElementById(id);
        var title = card.getElementsByClassName("card-header-title")[0];
        title.style.display = "none";
        var input = card.getElementsByTagName("input")[0];
        input.setAttribute("type", "text");
        input.focus();
        card.getElementsByTagName("input")[0].setAttribute("value", title.innerHTML);
    }

    saveTitle(id) {
        var card = document.getElementById(id);
        var title = card.getElementsByClassName("card-header-title")[0];
        title.style.display = "";
        var input = card.getElementsByTagName("input")[0];
        input.setAttribute("type", "hidden");
        title.innerHTML = input.value;
        var task = this.getTask(id);
        task.setName(input.value);
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
}

class Task {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
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

    setDescription(description) {
        this.description = description;
    }

    randomColor() {
        var classes = ['has-background-info', 'has-background-primary', 'has-background-link', 'has-background-warning', 'has-background-danger'];
        return classes[Math.floor(Math.random() * classes.length)];
        }
        generateCard() {
            // var card = this.htmlToElement('<div class="column"><div class="card" id="' + this.id + '"><header class="card-header"><p class="card-header-title" data-id="' + this.id + '">' + this.name + '</p><input data-id="' + this.id + '" class="note-title" name="name" type="hidden"></header><div class="card-content"><div class="content">' + this.description + '</div></div><footer class="card-footer"><a href="#" class="card-footer-item uppercase" data-id="' + this.id + '"><i class="fas fa-trash fa-lg red mr-7"></i> Delete</a></footer></div></div>');
            var card = this.htmlToElement(`<div class="tile is-parent is-vertical">
        <article class="tile is-child ${ this.randomColor() } notification is-primary">
          <p class="title">${ this.name }</p>
          <p class="subtitle">${this.description}</p>
        </article>
      </div>`)
            return card;
        }

        htmlToElement(html) {
            var template = document.createElement('template');
            // html = html.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            return template.content.firstChild;
        }
    }

    class EventHandler {
        constructor(app) {
            this.app = app;
        }

        editTitleListener() {
            var elementsArray = document.getElementsByClassName('card-header');
            for (var i = 0; i < elementsArray.length; i++) {
                elementsArray[i].childNodes[0].addEventListener("dblclick", (e) => {
                    var id = e.target.getAttribute("data-id");
                    this.app.editTaskName(id);
                });
                elementsArray[i].childNodes[1].addEventListener("focusout", (e) => {
                    var id = e.target.getAttribute("data-id");
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
            var elementsArray = document.getElementsByClassName('card-footer-item');
            for (var i = 0; i < elementsArray.length; i++) {
                elementsArray[i].addEventListener("click", (e) => {
                    var id = e.target.getAttribute("data-id");
                    this.app.removeTask(id);
                });
            }
        }

        editDescriptionListener() {
            var elementsArray = document.getElementsByClassName('card-header');
            for (var i = 0; i < elementsArray.length; i++) {
                elementsArray[i].childNodes[0].addEventListener("dblclick", (e) => {
                    var id = e.target.getAttribute("data-id");
                    this.app.editTaskName(id);
                });
                elementsArray[i].childNodes[1].addEventListener("focusout", (e) => {
                    var id = e.target.getAttribute("data-id");
                    this.app.saveTitle(id);
                });
            }
        }

        saveNewTaskFromModal() {
            var saveNoteButton = document.getElementById("save-task");
            saveNoteButton.addEventListener("click", (e) => {
                this.app.addNewNote();
            });
        }

        start() {
            this.removeNoteButtonListener();
            this.editTitleListener();
            this.addNewTaskModalOpen();
        }
        startOnce() {
            this.saveNewTaskFromModal();
        }
    }

    window.onload = () => {
        var tasks = JSON.parse(window.localStorage.getItem("tasks"));
        const app = new App(tasks);

        app.renderCardsWithTasks();
        app.startAddNoteEventListener();
        setTimeout(() => {
            app.startEventListener();
        }, 400)
    };