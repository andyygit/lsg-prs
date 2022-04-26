class Validate {
    passed = false
    errors = []
    check(source, rules) {
        for (let [key, value] of Object.entries(rules)) {
            let [unu, doi, trei, patru, cinci, sase, sapte, opt, noua, zece, unspe] = source
            switch(key) {
                case 'colet':
                    if (!unu.match(Object.values(value)[0])) {
                        this.addError(`Field ${key} must contain 11 digits!`, 'unu')
                    }
                break
                case 'nume':
                    if (value.required && doi == '') {
                        this.addError(`Field ${key} is mandatory!`, 'doi')
                    }
                break
                case 'tara':
                    if (value.required && trei == '') {
                        this.addError(`Field ${key} is mandatory!`, 'trei')
                    }
                break
                case 'codpostal':
                    if (!patru.match(Object.values(value)[0])) {
                        this.addError(`Field ${key} must contain 6 digits!`, 'patru')
                    }
                break
                case 'oras':
                    if (value.required && cinci == '') {
                        this.addError(`Field ${key} is mandatory!`, 'cinci')
                    }
                break
                case 'strada':
                    if (value.required && (sase == '' || sase == ' ')) {
                        this.addError(`Field ${key} is mandatory!`, 'sase')
                    }
                break
                case 'numar':
                    if (!(sapte.match(Object.values(value)[0]))) {
                        this.addError(`Field ${key} must be a number! insert contained letters in next field`, 'sapte')
                    }
                break
                case 'detaliiadresa':
                    if (value.required && opt == '') {
                        this.addError(`Field ${key} is mandatory!`, 'opt')
                    }
                break
                case 'contact':
                    if (value.required && noua == '') {
                        this.addError(`Field ${key} is mandatory!`, 'noua')
                    }
                break
                case 'telefon':
                    if (zece != '' && !zece.match(Object.values(value)[0])) {
                        this.addError(`Field ${key} must be a valid mobile number!`, 'zece')
                    }
                break
                case 'email':
                    if (value.required && unspe == '') {
                        this.addError(`Field ${key} is mandatory!`, 'unspe')
                    } else if (!(unspe.match(Object.values(value)[1]))) {
                        this.addError(`Field ${key} must be a valid email address!`, 'unspe')
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