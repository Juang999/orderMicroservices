const links = (routeName, data) => {
    let splitRoute = routeName.split(data[0])

    let route = splitRoute[0]+data[1]+splitRoute[1]

    return route
}

module.exports = links