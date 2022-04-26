// class Store {
//     static getData() {
//         let data;
//         if (localStorage.getItem('data') === null) {
//             data = []
//         } else {
//             data = JSON.parse(localStorage.getItem('data'))
//         }
//         return data
//     }
//     static addData(item) {
//         let data = Store.getData()
//         data.push(item)
//         localStorage.setItem('data', JSON.stringify(data))
//     }
//     static delData() {
//         localStorage.clear()
//     }
// }

// export { Store }

class Store {
    static getData(key) {
        let data
        if (localStorage.getItem(key) === null) {
            return false
        } else {
            data = JSON.parse(localStorage.getItem(key))
        }
        return data
    }
    static addData(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    }
    static delData() {
        localStorage.clear()
    }
}

export { Store }