"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _markdown = require("markdown");

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
    function App(tasks) {
        _classCallCheck(this, App);

        this.eventHandler = new EventListener(this);
        this.appStorage = window.localStorage;
        this.initializeTasksFromLocalStorage(tasks);
    }

    _createClass(App, [{
        key: "initializeTasksFromLocalStorage",
        value: function initializeTasksFromLocalStorage(tasks) {
            var _this = this;

            if (tasks == null) {

                this.tasks = [new Task(undefined, "Hello user!!!", "To add new note click 'new note' at the top of the page." + "To edit title/description just double click on the text. ;)")];
            } else {
                this.tasks = [];
                tasks.forEach(function (task) {
                    var note = new Task(Task.incrementId(), task.name, task.description);
                    _this.tasks.push(note);
                });
            }
        }
    }, {
        key: "startEventListener",
        value: function startEventListener() {
            this.eventHandler.start();
        }
    }, {
        key: "startAddNoteEventListener",
        value: function startAddNoteEventListener() {
            this.eventHandler.startOnce();
        }
    }, {
        key: "getStorage",
        value: function getStorage() {
            return this.appStorage;
        }
    }, {
        key: "renderCardsWithTasks",
        value: function renderCardsWithTasks() {
            var container_block = document.getElementById('tasks');

            if (this.tasks.length == 0) {
                container_block.innerHTML = "<h3>No tasks! Please add some. :)</h3>";
            } else {
                container_block.innerHTML = "";
            }
            this.tasks.forEach(function (task) {
                var card = task.generateCard();
                container_block.appendChild(card);
            });
        }
    }, {
        key: "addTask",
        value: function addTask(task) {
            this.tasks.push(task);
        }
    }, {
        key: "getTasks",
        value: function getTasks() {
            return this.tasks;
        }
    }, {
        key: "getTask",
        value: function getTask(id) {
            for (var i = 0; i < this.tasks.length; i++) {
                if (this.tasks[i].id == id) {
                    return this.tasks[i];
                }
            }
            return null;
        }
    }, {
        key: "editTaskName",
        value: function editTaskName(id) {
            var card = document.getElementById(id).childNodes;
            card[1].style.display = "none";
            var input = card[5];
            input.setAttribute("type", "text");
            input.focus();
            input.setAttribute("value", card[1].innerHTML);
        }
    }, {
        key: "saveTitle",
        value: function saveTitle(id) {
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
    }, {
        key: "addNewNote",
        value: function addNewNote() {
            var name = document.getElementById("modal-title-input");
            var description = document.getElementById("modal-description-input");

            this.tasks.push(new Task(Task.incrementId(), name.value, description.value));
            this.appStorage.setItem('tasks', JSON.stringify(this.tasks));

            this.renderCardsWithTasks();
            this.startEventListener();

            setTimeout(function () {
                name.value = "";
                description.value = "";
            }, 400);
        }
    }, {
        key: "removeTask",
        value: function removeTask(id) {
            this.tasks = this.tasks.filter(function (item) {
                return item.id != id;
            });
            this.appStorage.setItem('tasks', JSON.stringify(this.tasks));

            this.renderCardsWithTasks();
            this.startEventListener();
        }
    }]);

    return App;
}();

var Task = function () {
    function Task(id, name, description) {
        _classCallCheck(this, Task);

        this.id = id;
        this.name = name;
        this.description = description;
    }

    _createClass(Task, [{
        key: "setName",
        value: function setName(name) {
            this.name = name;
        }
    }, {
        key: "setDescription",
        value: function setDescription(description) {
            this.description = description;
        }
    }, {
        key: "randomColor",
        value: function randomColor() {
            var classes = ['has-background-info', 'has-background-primary', 'has-background-link', 'has-background-warning', 'has-background-danger'];
            return classes[Math.floor(Math.random() * classes.length)];
        }
    }, {
        key: "generateCard",
        value: function generateCard() {
            var card = this.htmlToElement("<div class=\"flex tile is-parent is-vertical\">\n                <article id=\"" + this.id + "\" class=\"article tile is-child " + this.randomColor() + " notification is-primary\">\n                  <p class=\"title\">" + this.name + "</p>\n                  <span class=\"remove\" id=\"" + this.id + "\"><i class=\"fas fa-trash fa-lg\"></i></span>\n                  <input type=\"hidden\" class=\"title stkv-o-text-input\"/>\n                  <p class=\"subtitle\">" + this.description + "</p>\n                </article>\n            </div>");
            return card;
        }
    }, {
        key: "htmlToElement",
        value: function htmlToElement(html) {
            var template = document.createElement('template');
            // html = html.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            return template.content.firstChild;
        }
    }], [{
        key: "incrementId",
        value: function incrementId() {
            if (!this.latestId) {
                this.latestId = 1;
            } else {
                this.latestId++;
            }
            return this.latestId;
        }
    }]);

    return Task;
}();

var EventListener = function () {
    function EventListener(app) {
        _classCallCheck(this, EventListener);

        this.app = app;
    }

    _createClass(EventListener, [{
        key: "editTitleListener",
        value: function editTitleListener() {
            var _this2 = this;

            var elementsArray = document.getElementsByClassName('article');
            for (var i = 0; i < elementsArray.length; i++) {
                elementsArray[i].childNodes[1].addEventListener("dblclick", function (e) {
                    var id = e.target.parentNode.id;
                    _this2.app.editTaskName(id);
                });
                elementsArray[i].childNodes[5].addEventListener("focusout", function (e) {
                    var id = e.target.parentNode.id;
                    _this2.app.saveTitle(id);
                });
            }
        }
    }, {
        key: "addNewTaskModalOpen",
        value: function addNewTaskModalOpen() {
            document.querySelector('a#open-modal').addEventListener('click', function (e) {
                e.preventDefault();
                var modal = document.querySelector('.modal'); // assuming you have only 1
                var html = document.querySelector('html');
                modal.classList.add('is-active');
                html.classList.add('is-clipped');

                modal.querySelector('.modal-background').addEventListener('click', function (e) {
                    e.preventDefault();
                    modal.classList.remove('is-active');
                    html.classList.remove('is-clipped');
                });

                modal.querySelector("#save-task").addEventListener('click', function (e) {
                    e.preventDefault();
                    modal.classList.remove('is-active');
                    html.classList.remove('is-clipped');
                });
            });
        }
    }, {
        key: "removeNoteButtonListener",
        value: function removeNoteButtonListener() {
            var _this3 = this;

            var elementsArray = document.getElementsByClassName('remove');
            console.log(elementsArray);
            for (var i = 0; i < elementsArray.length; i++) {
                elementsArray[i].addEventListener("click", function (e) {
                    var id = e.target.parentNode.parentNode.id;
                    _this3.app.removeTask(id);
                });
            }
        }

        /*
        editDescriptionListener() {
            var elementsArray = document.getElementsByClassName('title');
            console.log(elementsArray);
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
        */

    }, {
        key: "saveNewTaskFromModal",
        value: function saveNewTaskFromModal() {
            var _this4 = this;

            var saveNoteButton = document.getElementById("save-task");
            saveNoteButton.addEventListener("click", function (e) {
                _this4.app.addNewNote();
            });
        }
    }, {
        key: "start",
        value: function start() {
            this.removeNoteButtonListener();
            this.editTitleListener();
            this.addNewTaskModalOpen();
        }
    }, {
        key: "startOnce",
        value: function startOnce() {
            this.saveNewTaskFromModal();
        }
    }]);

    return EventListener;
}();

window.onload = function () {
    var tasks = JSON.parse(window.localStorage.getItem("tasks"));
    var app = new App(tasks);

    app.renderCardsWithTasks();
    app.startAddNoteEventListener();
    setTimeout(function () {
        app.startEventListener();
    }, 400);
};

console.log(_markdown2.default.toHTML("Hello *World*!"));