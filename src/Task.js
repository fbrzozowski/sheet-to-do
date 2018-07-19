export default class Task {
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

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    generateCard() {
        var card = this.htmlToElement(
            `<div class="flex tile is-parent is-vertical">
                <article id="${ this.id }" class="article tile is-child ${ this.color } notification is-primary">
                  <p class="title">${ this.name }</p>
                  <div class="subtitle">${ this.description }</div>
                  <span class="remove"><i class="fas fa-trash fa-lg"></i></span>
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
