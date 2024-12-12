const makeQueryFromArray = (param, array) => {
    let query = '';

    for (let i = 0; i < array.length; i++) {
        query += `&${param}[]=` + array[i];
    }

    return query.slice(1);
}

const makeQuery = (data) => {
    let queryString = ``;
    Object.keys(data).forEach((el) => {
        if (data[el] === null || data[el] === undefined) {
        } else if (typeof data[el] === "object") {
            queryString += `&${makeQueryFromArray(el, data[el])}`;
        } else {
            queryString += `&${el}=${data[el]}`;
        }
    })
    return queryString.slice(1);
}


module.exports = {
    makeQueryFromArray,
    makeQuery
}
