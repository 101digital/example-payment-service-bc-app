# Example Payment Service BC Client

# Table of Contents
1. [Getting start](#getting-start)
2. [Psudo Code ](#code)
3. [Example](#examples)
4. [Fourth Example](#fourth-examplehttpwwwfourthexamplecom)

## Getting start <a name="getting-start"></a>

1. Clone code 
```
git clone git@github.com:101digital/example-payment-service-bc-app.git /tmp/web-client
```
2. Setup local environment
```
cd tmp/web-client
yarn install
```
3. Start local application
```
yarn start
```
4. Open http://localhost:4000 And start testing using Test Credicard from https://docs.adyen.com/development-resources/test-cards/test-card-numbers

5. Test with [ive demo page](ttps://sandbox-pay.101digital.io/invoices?sharingKey=eyJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZUlkIjoiMGVkMDZhZDEtODM4Zi00MmRiLTk0MjMtNTJmNDY5MDI3YzlhIiwiaXNzIjoiMTAxRCIsImV4cCI6MTYwOTczOTk2NCwidXNlcklkIjoiIiwib3JnSWQiOiIifQ.Ygs6ktTDBa-5jI7kizhffZWRcrn0e2-SHvcXW9OZJDo)

## Psudo Code <a name="code"></a> 
See also: [`src/index.js`](https://github.com/101digital/example-payment-service-bc-app/blob/master/src/pages/index.js)
1. Get available payment method
```
const getPaymmentMethod = async ()=> {
  let resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/paymentMethods?documentId=${process.env.REACT_APP_DOCUMENT_ID}&documentType=${process.env.REACT_APP_DOCUMENT_TYPE}`)
  return resp.data
}
```

2. Make Payment
```
const makePayment = async (state) => {

  let resp = await axios.post(`${process.env.REACT_APP_BASE_URL}/payments`, {
    documentId: process.env.REACT_APP_DOCUMENT_ID,
    documentType: process.env.REACT_APP_DOCUMENT_TYPE,
    paymentMethod: state.data.paymentMethod,
    browserInfo: state.data.browserInfo,
    origin: window.location.origin,
    returnUrl: "http://localhost:4000/checkout.html",
    redirectFromIssuerMethod: 'GET'
  })

  return resp.data

}
```
4. Submit additional payment detail
```
const makePayment = async (state) => {

  let resp = await axios.post(`${process.env.REACT_APP_BASE_URL}/payments`, {
    documentId: process.env.REACT_APP_DOCUMENT_ID,
    documentType: process.env.REACT_APP_DOCUMENT_TYPE,
    paymentMethod: state.data.paymentMethod,
    browserInfo: state.data.browserInfo,
    origin: window.location.origin,
    returnUrl: "http://localhost:4000/checkout.html",
    redirectFromIssuerMethod: 'GET'
  })

  return resp.data

}
```

## Examples <a id="examples"></a>
