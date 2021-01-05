# Example Payment Service BC Client

# Table of Contents
1. [Getting start](#getting-start)

   1.1. [Get code](#clone)   
   
   1.2. [Setup local environment](#setup)
   
   1.3. [Testing](#test)
   
2. [Psudo Code ](#code)

   2.1. [Get avaialbe payment methods](#paymentMethod)
   
   2.2. [Make payment](#makePaymen)
   
   2.3. [Sumit additional details](#submitAdditionalDetails)   
   
3. [Examples](#examples)
   3.1. [Card](#card)
   
   3.2. [Poli](#poli)
   
   3.3. [Paypal](#paypal)
   


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

1. WebDropIn config
```
const configuration = {
    paymentMethodsResponse: {}, // The `/paymentMethods` response from the server.
    clientKey: process.env.REACT_APP_ADYEN_API_KEY , // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
    locale: "en-US",
    environment: "test",
    onSubmit: (state, dropin) => {
        console.log(state)
        // Your function calling your server to make the `/payments` request
        makePayment(state)
          .then(response => {
            if (response.paymentId) {
                localStorage.setItem('paymentId', response.paymentId) //Store paymentId in localstore for next API call
            }
            console.log(response)

            if (response.action) {
              // Drop-in handles the action object from the /payments response
                dropin.handleAction(response.action);
            } else {
              dropin.setStatus('success', { message: 'Payment successful!' });

            }
          })
          .catch(error => {
            throw Error(error);
          });
      },
    onAdditionalDetails: (state, dropin) => {
      if (state) {
        state.data.paymentId = localStorage.getItem('paymentId') || ''

        makeDetailsCall(state.data)
        .then(response => {
          console.log(response)
          if (response.action) {
            // Drop-in handles the action object from the /payments response
            dropin.handleAction(response.action);
          } else {
            // Your function to show the final result to the shopper
            dropin.setStatus('success', { message: 'Payment status: ' + response.status });
          }
        })
        .catch(error => {
          throw Error(error);
        });
      }
    },
    onError(error) {
      console.error(error)
    }
   };
```
2. Get available payment method
```
const getPaymmentMethod = async ()=> {
  let resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/paymentMethods?documentId=${process.env.REACT_APP_DOCUMENT_ID}&documentType=${process.env.REACT_APP_DOCUMENT_TYPE}`)
  return resp.data
}
```

3. Make Payment
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
