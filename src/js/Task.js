export default class Task {
    constructor(id, name, description, color = 'has-background-info') {
        this.id = id;
        this.name = name;
        this.description = description;
        this.color = color;
    }

    static incrementId() {
        if (!this.latestId) {
            this.latestId = 1;
        } else {
            this.latestId++;
        }
        return this.latestId;
    }

    generateCard() {
        var card = this.htmlToElement(
            `<div class="flex tile is-parent is-vertical">
                <article id="${ this.id }" class="article tile is-child ${ this.color } notification is-primary">
                  <p class="title" contenteditable="true">${ this.name }</p>
                  <div class="subtitle" contenteditable="true">${ this.description }</div>
                  <span class="remove-container"><div id="dropdown" class="dropdown is-right">
                    <div class="dropdown-trigger">
                        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span class="icon is-small">
                                <i class="fab fa-lg fa-whmcs"></i>
                            </span>
                        </button>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                            <a class="remove dropdown-item is-red"><i class="fas fa-trash-alt"></i> Delete</a>
                            <hr class="dropdown-divider">
                            <div class="dropdown-item is-centered">
                                <p><i class="fas fa-palette"></i> Color picker</p>
                            </div>
                            <a data-color="has-background-dark" class="color is-primary dropdown-item">dark</a>
                            <a data-color="has-background-primary" class="color dropdown-item">primary</a>
                            <a data-color="has-background-info" class="color dropdown-item">info</a>
                            <a data-color="has-background-link" class="color dropdown-item">link</a>
                            <a data-color="has-background-success" class="color dropdown-item">success</a>
                            <a data-color="has-background-warning" class="color dropdown-item">warning</a>
                            <a data-color="has-background-danger" class="color dropdown-item">danger</a>
                        </div>
                    </div>
                </div>
                </span>
                </article>
            </div>`
        );
        return card;
    }

    htmlToElement(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
    }
}