const getEnv = (prop) => {
 return  window[prop] || getDefault(prop)
}

const getDefault = (prop) => {
    switch(prop) {
        case 'AUTHORAZION_URL':
            return 'http://test/'
            break;
        default:
            throw new Error (`Missing property ${prop}`)
    }
}

export default {
    get: getEnv
}