class Output {
    constructor(data, place) {
        this.data = data
        this.place = place
    }
    clear() {
        let last
        while (last = this.place.lastChild) this.place.removeChild(last)
    }
    render() {
        let card = document.createElement('div')
        card.className = 'card flex-col'
        let row = document.createElement('p')
        row.innerHTML = this.data
        card.appendChild(row)
        this.place.appendChild(card)
    }
}

class Showerrors {
    constructor(errors) {
        this.errors = errors
    }
    render() {
        this.errors.forEach(item => {
            let alert = document.createElement('span')
            alert.className = 'text-danger'
            alert.textContent = item.message
            let target = document.getElementById(item.field)
            let child = target.nextElementSibling
            if (child && child.classList.contains('text-danger')) {
                child.remove()
            }
            target.insertAdjacentElement('afterend', alert)
        })
    }
}

class Showwarning {
    constructor(warning, classname) {
        this.warning = warning
        this.classname = classname
    }
    render() {
        let message = document.createElement('div')
        message.className = this.classname
        let n1 = document.createElement('span')
        n1.className = 'closebtn'
        n1.setAttribute('onclick', `this.parentElement.style.display = 'none';`)
        n1.textContent = '×'
        message.appendChild(n1)
        let n2 = document.createElement('strong')
        n2.textContent = this.warning
        message.appendChild(n2)
        let target = document.querySelector('form')
        let before = document.querySelector('.path')
        target.insertBefore(message, before)
        // scroll
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }
    removeWarning() {
        setTimeout(() => {
            let warning = document.querySelector('.warning')
            let danger = document.querySelector('.danger')
            if (warning) {
                warning.remove()
            } else if (danger) {
                danger.remove()
            }
        }, 5000)
    }
}

export { Output, Showerrors, Showwarning }