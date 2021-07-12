const getEnv = (prop) => {
 return  window[prop] || getDefault(prop)
}

const getDefault = (prop) => {
    switch(prop) {
        case 'AUTHORAZION_URL':
            return 'https://101digitalpte--developerp.my.salesforce.com/services/oauth2/authorize'

        case 'TOKEN_ENDPOINT':
            return 'https://101digitalpte--developerp.my.salesforce.com/services/oauth2/token'

        case 'CLIENT_ID':
            return '3MVG9ZUGg10Hh226owwsQMmIS5CvPmm87zHWS250MfLlplRauXlxEBQw01l3tfFbJNCCMVAXuXiZP56iq4Q3C'

        case 'CLIENT_SECRET':
            return '18F79F61404B956B146C2BA62D52A0811507DD6E8FA40F4689825A4AEFB6AD93'

        case 'INSTANCE_URL':
            return localStorage.getItem('instanceUrl') || 'https://101digitalpte--developerp.my.salesforce.com'
        case 'HOME_PAGE':
            return '/products'
        default:
            throw new Error (`Missing property ${prop}`)
    }
}

export default {
    get: getEnv
}