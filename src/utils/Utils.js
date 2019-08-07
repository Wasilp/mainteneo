function groupBy(array, key){
    let index = 0;
    let dic =  {};
    const result = [];
    array.forEach(item => {
        if (dic[item[key]] == undefined){
            dic[item[key]] = index;
            index++;
            let keyObj= {
                "values" : []
            };
            keyObj[key] = item[key];
            result.push(keyObj);
        }
        result[dic[item[key]]].values.push(item)
    })
    return result
}

export default {
    groupBy 
}