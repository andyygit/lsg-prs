import { Validate } from './Validate.js'
import { Store } from './Store.js'
import { Output, Showerrors, Showwarning } from './Output.js'

// UI elems
const out = document.getElementById('output')
const keyword = document.getElementById('keyword')
const keywordOut = document.getElementById('keywordout')
const tabs = Array.from(document.querySelectorAll('.tab'))
const tos = document.getElementById('tos')
const tosCheck = document.getElementById('tos-check')
const next = document.getElementById('next')
const cancel = document.getElementById('cancel')

// Inputs (no value)
const unu = document.getElementById('unu')
const doi = document.getElementById('doi')
const trei = document.getElementById('trei')
const patru = document.getElementById('patru')
const cinci = document.getElementById('cinci')
const sase = document.getElementById('sase')
const sapte = document.getElementById('sapte')
const opt = document.getElementById('opt')
const noua = document.getElementById('noua')
const zece = document.getElementById('zece')
const unspe = document.getElementById('unspe')

// Helper function for zipcode autocomplete, address output clearing
let activate = e => {
    patru.value = e.target.dataset.zipcode
    cinci.value = e.target.dataset.city
    sase.value = e.target.dataset.street
    keyword.value = `${e.target.dataset.zipcode} - ${e.target.dataset.city}, ${e.target.dataset.street}`
    keywordOut.firstElementChild.remove()
}

// pagination counter
let counter = 1

window.addEventListener('DOMContentLoaded', () => {
    // empty storage
    if (localStorage.length !== 0) {
        Store.delData()
    }
    // prevent enter key submission
    document.addEventListener('keypress', e => {
        if ((e.code === 'Enter' || e.code === 'NumpadEnter') && e.target.nodeName !== "TEXTAREA") {
            e.preventDefault()
        }
    })
    // popover
    document.querySelector('.help').addEventListener('click', () => {
        let popover = document.querySelector('.popover')
        if (popover.classList.contains('active')) {
            popover.classList.remove('active')
        } else {
            popover.classList.add('active')
        }
    })
})

keyword.addEventListener('keyup', e => {
    let keyPressCount = e.target.value.length
    if (keyPressCount > 2) {
        let formData = new FormData()
        formData.append('keyword', e.target.value)
        fetch('fetch.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (keywordOut.childElementCount != 0) {
                keywordOut.firstElementChild.remove()
            }
            let output = document.createElement('ul')
            data.forEach(item => {
                let line = document.createElement('li')
                line.setAttribute('data-city', `${Object.values(item.city)}`)
                line.setAttribute('data-zipcode', `${Object.values(item.zip_code)}`)
                line.setAttribute('data-street', `${Object.values(item.street)}`)
                line.appendChild(document.createTextNode(`${Object.values(item.zip_code)} - ${Object.values(item.county)} - ${Object.values(item.city)}, ${Object.values(item.street)}`))
                line.addEventListener('click', activate)
                output.appendChild(line)
            })
            keywordOut.appendChild(output)
        })
        .catch(err => console.log(err))
        // console.log(keyPressCount)
    } else if (keywordOut.childElementCount != 0) {
        keywordOut.firstElementChild.remove()
    }
})

cancel.addEventListener('click', e => {
    e.preventDefault()
    Store.delData()
    window.location.reload()
})

next.addEventListener('click', e => {
    e.preventDefault()
    switch (counter) {
        case 1:
            //clear alerts
            let alerts = document.querySelectorAll('.text-danger')
            alerts.forEach(item => {
                item.remove()
            })
            //get input
            let inputsArray = [unu.value, doi.value, trei.value, patru.value, cinci.value, sase.value, sapte.value, opt.value, noua.value, zece.value, unspe.value]
            //validation
            let validation = new Validate()
            validation.check(inputsArray, {
                colet: {
                    matches: /^\d{11}$/
                },
                nume: {
                    required: true,
                },
                tara: {
                    required: true
                },
                codpostal: {
                    matches: /^\d{6}$/
                },
                oras: {
                    required: true
                },
                strada: {
                    required: true
                },
                numar: {
                    matches: /^\d*$/
                },
                detaliiadresa: {
                    required: false
                },
                contact: {
                    required: false
                },
                telefon: {
                    matches: /^0\d{9}$/
                },
                email: {
                    required: true,
                    matches: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
                }
            })
            if (validation.passed) {
                //2nd validation - tracking valid parcelnumber
                const parcel = new FormData()
                parcel.append('awb', inputsArray[0])
                fetch('trac.php', {
                    method: 'POST',
                    body: parcel
                })
                .then(res => res.json())
                .then(data => {
                    if (data.msg != 'Parcel is delivered') {
                        let warning = new Showwarning(data.msg, 'danger')
                        warning.render()
                        warning.removeWarning()
                    } else {
                        fetch('db.php', {
                            method: 'POST',
                            body: parcel
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.msg != 'No results found!') {
                                let warning = new Showwarning(data.msg, 'danger')
                                warning.render()
                                warning.removeWarning()
                            } else {
                                // add initial parcel to store
                                Store.addData('colet', inputsArray[0])
                                //go to next page
                                let content = `<h2>Pick order details</h2><br><p><b>From:</b> ${doi.value}</p><p><b>Pickup city:</b> ${cinci.value}</p><p><b>Address:</b> ${sase.value}, ${sapte.value}, ${opt.value}</p><p><b>Zipcode:</b> ${patru.value}</p><p><b>Contact:</b> ${noua.value}</p><p><b>Phone:</b> ${zece.value}</p><p><b>E-mail:</b> ${unspe.value}</p><br><br><p>If information submitted is not correct, press "Cancel" and start over completing the form!</p>`
                                let output = new Output(content, out)
                                output.clear()
                                output.render()
                                counter = 2
                                tos.classList.remove('hidden')
                                //classlist tab active
                                tabs[0].classList.remove('active')
                                tabs[1].classList.add('active')
                            }
                        })
                        .catch(err => console.log(err))
                    }
                })
                .catch(err => console.log(err))
            } else {
                let errors = new Showerrors(validation.errors)
                errors.render()
            }
        break
        case 2:
            //agree to tos
            if (tosCheck.checked) {
                //get date
                fetch('getdate.php')
                .then(res => res.json())
                .then(data => {
                    //create parcel data
                    let parcels = [
                        {
                            ClientNumber: '?',
                            ClientReference: '',
                            CODReference: '',
                            Content: '',
                            Count: 1,
                            DeliveryAddress: {
                                City: 'Oras',
                                ContactEmail: '',
                                ContactName: 'contact name',
                                ContactPhone: '0300000000',
                                CountryIsoCode: 'RO',
                                HouseNumber: '8',
                                Name: 'name',
                                Street: 'strada',
                                ZipCode: '050000',
                                HouseNumberInfo: '-8A'
                            },
                            PickupAddress: {
                                City: cinci.value,
                                ContactEmail: unspe.value,
                                ContactName: noua.value,
                                ContactPhone: zece.value,
                                CountryIsoCode: trei.value,
                                HouseNumber: sapte.value,
                                Name: doi.value,
                                Street: sase.value,
                                ZipCode: patru.value,
                                HouseNumberInfo: opt.value
                            },
                            PickupDate: data.message,
                            ServiceList: [
                                {
                                    Code: 'PRS'
                                }
                            ]
                        }
                    ]
                    Store.addData('apidata', parcels)
                    // preloading
                    let content2 = ''
                    let output2 = new Output(content2, out)
                    output2.clear()
                    //api call
                    let apiData = new FormData()
                    apiData.append('apidata', JSON.stringify(Store.getData('apidata')))
                    fetch('order.php', {
                        method: 'POST',
                        body: apiData
                    })
                    .then(res => res.blob())
                    .then(myBlob => {
                        // console.log(myBlob)
                        if (window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveBlob(myBlob, 'fileName.pdf')
                        } else {
                            let downloadLink = document.createElement('a');
                            downloadLink.textContent = 'Pickup order'
                            downloadLink.href = window.URL.createObjectURL(new Blob([myBlob], { type: 'application/pdf' }))
                            downloadLink.download = 'fileName.pdf'
                            let content3 = `<h3>Downdload the order by clicking the link below:</h3><br><br>`
                            let output3 = new Output(content3, out)
                            output3.render()
                            document.getElementById('output').firstChild.appendChild(downloadLink)
                        }
                    })
                    .catch(err => console.log(err))
                    // write to db
                    let dbData = new FormData()
                    dbData.append('colet', Store.getData('colet'))
                    fetch('db.php', {
                        method: 'POST',
                        body: dbData
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.msg != 'OK') {
                            let warning = new Showwarning(data.msg, 'danger')
                            warning.render()
                        }
                    })
                    .catch(err => console.log(err))
                    counter = 3
                    tos.classList.add('hidden')
                    //classlist tab active
                    tabs[1].classList.remove('active')
                    tabs[2].classList.add('active')
                })
                .catch(err => console.log(err))
                //reset buttons
                cancel.style.display = 'none'
                next.textContent = 'Start a new Pick order'
                next.addEventListener('click', e => {
                    e.preventDefault()
                    window.location.reload()
                })
            } else {
                let warning = new Showwarning('It is necessarry to agree with the Terms of Service', 'danger')
                warning.render()
                warning.removeWarning()
                return false
            }
        break
        case 3:
            //send
            //classlist tab active
            //clear storage
            //reload page
        break
    }
})