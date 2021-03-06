export default class EventListener {
    constructor(app) {
        this.app = app;
    }

    dropdownListener() {
        var dropdownTriggers = Array.prototype.slice.call(document.getElementsByClassName('dropdown-trigger'));
        dropdownTriggers.forEach(element => {
            element.addEventListener('click', event => {
                var article = event.target.closest('article');
                article.querySelector('.dropdown-menu').classList.toggle('is-active');
            });
            element.addEventListener('focusout', event => {
                var article = event.target.closest('article');
                setTimeout(() => {
                    article.querySelector('.dropdown-menu').classList.toggle('is-active');
                }, 200);
            });
        });
    }

    changeColorListener() {
        var colorList = Array.prototype.slice.call(document.getElementsByClassName('color'));
        colorList.forEach(element => {
            element.addEventListener('click', event => {
                var id = event.target.closest('article').id;
                var color = event.target.getAttribute('data-color');
                this.app.setTaskColor(id, color);
            });
        });
    }

    editTitleListener() {
        var elementsArray = Array.prototype.slice.call(document.getElementsByClassName('article'));
        var container = '.title';

        elementsArray.forEach(element => {
            element.querySelector(container).addEventListener('focusout', (e) => {
                var id = e.target.parentNode.id;
                this.app.saveTaskData(id, container);
            });

        });
    }
    editDescriptionListener() {
        var elementsArray = Array.prototype.slice.call(document.getElementsByClassName('article'));
        var container = '.subtitle';

        elementsArray.forEach(element => {
            element.querySelector(container).addEventListener('focusout', (e) => {
                var id = e.target.closest('article').id;
                this.app.saveTaskData(id, container);
            }, true);
        });
    }

    menuBurgerListener() {
        var navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'));
        navbarBurgers.forEach(element => {
            element.addEventListener('click', () => {
                var target = document.getElementById(element.dataset.target);
                element.classList.toggle('is-active');
                target.classList.toggle('is-active');
            });
        });
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

            modal.querySelector('#save-task').addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.remove('is-active');
                html.classList.remove('is-clipped');
            });
        });
    }

    removeNoteButtonListener() {
        var elementsArray = Array.prototype.slice.call(document.getElementsByClassName('remove'));
        elementsArray.forEach(element => {
            element.addEventListener('click', event => {
                var id = event.target.closest('article').id;
                this.app.removeTask(id);
            });
        });
    }

    saveNewTaskFromModal() {
        var saveNoteButton = document.getElementById('save-task');
        saveNoteButton.addEventListener('click', () => {
            return this.app.addNewNote();
        });
    }

    start() {
        this.menuBurgerListener();
        this.dropdownListener();
        this.removeNoteButtonListener();
        this.editTitleListener();
        this.addNewTaskModalOpen();
        this.editDescriptionListener();
        this.changeColorListener();
    }
    startOnce() {
        this.saveNewTaskFromModal();
    }
}