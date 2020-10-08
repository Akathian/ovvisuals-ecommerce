function moveToAccounting(cart) {

    let a = Object.entries(cart)
    let totalWithSH = a.pop()[1]
    let total = a.pop()
    let ship = a.pop()
    let itemQty = a.pop()
    let names = ''
    for (let item of a) {
        let b = Object.entries(item)
        let c = b.pop()
        let d = c.pop()
        let e = Object.entries(d)
        for (let ind of e) {
            let name = ind[1].name + " " + ind[1].size
            names += name + "\n"
        }
    }
}
