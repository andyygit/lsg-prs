class Validate {
    passed = false
    errors = []
    check(source, rules) {
        for (let [key, value] of Object.entries(rules)) {
            let [unu, doi, trei, patru, cinci, sase, sapte, opt, noua, zece, unspe] = source
            switch(key) {
                case 'colet':
                    if (!unu.match(Object.values(value)[0])) {
                        this.addError(`Campul ${key} trebuie să fie format din 11 cifre!`, 'unu')
                    }
                break
                case 'nume':
                    if (value.required && doi == '') {
                        this.addError(`Campul ${key} este obligatoriu!`, 'doi')
                    }
                break
                case 'tara':
                    if (value.required && trei == '') {
                        this.addError(`Campul ${key} este obligatoriu!`, 'trei')
                    }
                break
                case 'codpostal':
                    if (!patru.match(Object.values(value)[0])) {
                        this.addError(`Campul ${key} trebuie să fie format din 6 cifre!`, 'patru')
                    }
                break
                case 'oras':
                    if (value.required && cinci == '') {
                        this.addError(`Campul ${key} este obligatoriu!`, 'cinci')
                    }
                break
                case 'strada':
                    if (value.required && (sase == '' || sase == ' ')) {
                        this.addError(`Campul ${key} este obligatoriu!`, 'sase')
                    }
                break
                case 'numar':
                    if (!(sapte.match(Object.values(value)[0]))) {
                        this.addError(`Campul ${key} trebuie să fie un număr! treceți literele conținute în câmpul următor`, 'sapte')
                    }
                break
                case 'detaliiadresa':
                    if (value.required && opt == '') {
                        this.addError(`Campul ${key} este obligatoriu!`, 'opt')
                    }
                break
                case 'contact':
                    if (value.required && noua == '') {
                        this.addError(`Campul ${key} este obligatoriu!`, 'noua')
                    }
                break
                case 'telefon':
                    if (zece != '' && !zece.match(Object.values(value)[0])) {
                        this.addError(`Campul ${key} trebuie să fie un număr de telefon valid!`, 'zece')
                    }
                break
                case 'email':
                    if (value.required && unspe == '') {
                        this.addError(`Campul ${key} este obligatoriu!`, 'unspe')
                    } else if (!(unspe.match(Object.values(value)[1]))) {
                        this.addError(`Campul ${key} trebuie sa contina o adresa de mail valida!`, 'unspe')
                    }
                break
            }
        }
        if (this.errors.length == 0) {
            this.passed = true
        }
    }
    addError(error, field) {
        this.errors.push(
            {
                message: error,
                field: field
            }
        )
    }
    errors() {
        return this.errors
    }
    passed() {
        return this.passed
    }
}

export { Validate }