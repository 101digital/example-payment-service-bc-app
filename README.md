# Example Payment Service BC Client

# Table of Contents
1. [Getting start](#getting-start)

   1.1. [Get code](#clone)   
   
   1.2. [Setup local environment](#setup)
   
   1.3. [Testing](#test)
   
2. [Psudo Code ](#code)

   2.1. [Get avaialbe payment methods](#paymentMethods)
   
   2.2. [Make payment](#makePayment)
   
   2.3. [Sumit additional details](#submitAdditionalDetails)   
   
3. [Examples](#examples)

   3.1. [Simple Card payment](#card)
   
   3.2. [3D Secure Card payment](#card3d)
      
   3.3. [Poli payment ](#poli)
   
   3.4. [Paypal payment](#paypal)
   


## Getting start <a id="getting-start"></a>

1. Clone code <a id="clone"></a>
```
git clone git@github.com:101digital/example-payment-service-bc-app.git /tmp/web-client
```
2. Setup local environment <a id="setup"></a>
```
cd tmp/web-client
yarn install
```
3. Start local application
```
yarn start
```
4. Open http://localhost:4000 And start testing using Test Credicard from https://docs.adyen.com/development-resources/test-cards/test-card-numbers <a id="test"></a>

5. Test with [live demo page](https://sandbox-pay.101digital.io/invoices?sharingKey=eyJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZUlkIjoiZTI4YmM1ZjMtOTc4OC00YTBkLTgzM2YtMTRhZjY3NWExOWJmIiwiaXNzIjoiMTAxRCIsImV4cCI6MTYxMjQyMDY4NCwidXNlcklkIjoiIiwib3JnSWQiOiIifQ.UAZLF94J86r-6OpFVYkmCjZ1B867YiloP0cBCIxpQGI)

## Psudo Code <a id="code"></a> 
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
2. Get available payment method <a id="paymentMethods"></a>
```
const getPaymmentMethod = async ()=> {
  let resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/paymentMethods?documentId=${process.env.REACT_APP_DOCUMENT_ID}&documentType=${process.env.REACT_APP_DOCUMENT_TYPE}`)
  return resp.data
}
```

3. Make Payment<a id="makePayment"></a>
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
4. Submit additional payment detail<a id="submitAdditionalDettails"></a>
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
1. Get Payment Method `GET /paymentMethods`

Response: 
```
ss
```

2. Simple Card  <a id="card"></a>
   Init payment `POST /payments`
   
    Request Body:
    ----
    ```javascript
    {"documentId":"dkjJHFJ87238476FDG","documentType":"INVOICE","paymentMethod":{"type":"scheme","holderName":"test","encryptedCardNumber":"adyenjs_0_1_25$nCmMJjZw6btyZ6eN+1q0hLAfvwyITOzhK9tu+5KilEUpCCEvJ/QoedDBTyJcwS6AWnGHznMht4Rj2G5Wh7cnZhtwY07dNnjOG9oXJ1BodKePq53BAMeUQny1AbzmIXhaHvKJtYVvJMs4WH9DrTpEiSObXIJ7TMPMJec5oJt3298SN4dK/0faSEaZ/2HWaI2VrrAyyn/2hFwg/c5gyDF7unAHmnjFz/uG+q716qirP3SpM9BrX7CNneh6CdTGBZRfPpFmDZluybKyhHISpbCeSO4gret3lGwLDwxRYjEh7HsL4CBcFPrY4mZZBb/oH+odRN7pd77C7cP/Iun85Tw4hA==$jOOZvrrnhqECQr9kAc3sek5WCoh6aeJr1psqYCkXV33Jmmdw+FFTH+wwmbdxFe+XnPyeuCA6Folcf/ng+Bs7bDQqtJ/a1kfy8tSsJdOSwGlSFwwqAsThRqmSQCgjbZSrz9YIVUA3VUkO99MseDAh6PZWVJyZn9bGtS5HJBN99JuWLA37XqHt64YY5egHOYe+Lc2eIyLGdRbyss+Z9EhwsvP9XoKLciP6Rqa917RhbOKWEBMeKkbbuA5fSaqse2CfDSa2m5mE7Gvgvm6ELglR9+41C92E2jMn7PqPodlFImVS2QcN4NG7JVYPmaQxp8rD7YEn2hMepvDIlUSbPDit5/eEwHJggL100oMiS3Mxy718077zVQzkWSZhVUxEp1wyeUPA0XiZYjnRvtaffvWuCBoCSnRArsvbW1p1qihNYBy8Lws8m/IIbDuR0VyfNn6uxvj+5FP52NxgHXtUm6NzImXebJhs2XNIJzB2TNwpdBL87WIFnjDTTmys5RYg3Hek7fU5DsgWqZc4cNlmcm+AMHCOTHP7rTtZzlPG62ZQ01vQVHkpTYmPZyID5qQvVvCiK+zZlx9gdEMKrjF4HCsehhTGM1Xyr2osUNaE+lHvHOHg9jF6wAyTgqYC4wuoR2fJHgrOBvpU51hh+Dz8dy11Hgje1jJv09+5kWYX9PGGgL9SJbcJ6a9qGNqM2TX3VloR05z5sgdJ3Y8Z+okav6+fztawdSz/","encryptedExpiryMonth":"adyenjs_0_1_25$Y/yRQDHDYA/Opnpw7Cmixufe9/1dBGTvWLdiZte2GA56mvmlmdNwPyzEit3w+ne0Fj5kpkhVFsiNGJIvdZguTxspHhwWotO2p//vK+aq1e9MVr+MXw4VuGRdRcpr9BNA84FztTE19ZoK+f41gGiapfcNH9Sx0tcUD4q7LJPJIB60xYKBd/O2bBfvpuR/FtXuiKNG5/TwFEXSZfwyxJXKldi5RG/HPgFWam6RXEUrWWNImeSZjs52QQ8bEU/U0QvSTs7L89GY+ZPMg2sE+vGSoVWvN3i9eUEL9DTFYMzQo/dFTglfkYY+UKfOc6EbHG2HxQi3cGbaR+og/s6CVPw+nw==$Qwg2NUzI8lPs68yiJFbOqjpysAhMnsDPJ2c2zSu2XwronOMpx9MX6oSuntzac3uvzod9dB4/u3KaeKhjT6vtOfMNvNpUq6nRcoLX+ZFeT65yOD+jafH2XCXwsJJMhF5BwnvVNPsM+2MQ8yOV7rsiy+ZOYp7Uc0/bl4RQrUciMT9XT0iNFTF7YkO/ucCZ6bopxMkYxxtdEyObu3N84HxeTnw9mcIFj5GRN7uiRxJrsmpqtxw9nWTBhGPTZGeAg1aip6H1k8caJO7TDqQ/EwPgLXxGVLAdxJDTAGQxuU5Q/1oaX68WYNIUDp4PwzkiHGFjwx9BVuUgZ/F2Ote4hIjSvmcNh9ECm5CldaexfeG9HP8onRW6GtoB8CBgyJ3AkAh+SOCPPODjD3GB/tqiIoX1r1I0kaIhzZyvLxkLmuvZxUt+ZBI=","encryptedExpiryYear":"adyenjs_0_1_25$n9sEOc3t6bB1Emga05NI+LwP/tvjxh2Q5ecL0/zxrImoK9NFdHQOZKT3T6AdMgCBBilsOVEiMR7FvXKCgpJUqn+SIhlDrjwOkNsE++3zJjB6is72xaTsYbgXZs+X+D275OLt+CMzadzprP0LOQShzjHNdA+y0G3QdonH9AsevQB+a6iJQJQWzSU9Cdmiu9/UxSso98zyVBq2TJykumI1gZN7TxuFUvplS8BWwEoGt+zF7vAym9wNnxYU2GabTMEQCEIvmOKMWWb8pj9Vmp4rg11e9RBLpRNauGaQhKtAJy7FUhddIrzMD5Bk63tGUMdaMiFxXCRXMIL28yfL7uphhA==$kSvbDsBaPIKIgEsfwZKdRBvS57jmvFA7sykJl6X2BuwEvE8/RPsk66pjeIIQEFCX6FqTgPR+KQHa3Oo10713jCbr9l8wG59tr5QEpVFJG4sQaQ1FUgkdaPreHEpaNrmdjaigVbVRYTdIlUOFnzMf1Gp3sxHJzwZaTKis4mF7Q3uuMTKLaGqwmNcbg/Gdz9AGDCVkURI4qIUDvT9I0/e/1lDB8F+MUmys9nI6Lvc3dTkX5Y4IlVd3gRWbb3NrgUhGQ7Ql+dfAavQ1feyEK9Tp7Hbqz60zRf3rRVqJX2pK7u9TwUPkqHzWbDEMFvDFKJ2QTL1ceqiVnldmRrU2JO/AOl2z1oVpejJmMoi/tIemEsyBYVl0ojTrAPmeR8ZsXn/ydVNAdqE9lktRAaRxk6BaRyaXQuiiVWTPOTuTR0d54V8VtQ3v","encryptedSecurityCode":"adyenjs_0_1_25$SdaJArrf/BQfMVIwbUecbwJ2H6LKYu3unKd7SpB7TkpXeSPPQupCFX63e7n67BEocOAQAEiZ2RPJh1zA09eClQrA1JhZtducLHQZOCtgUhSqRMmauDP6TwYWHQllVsK/EUf/XiYUNvlz2vtRuQ9yoimfyKb9DvlIOKPndjkHAYgSJhyOHRfYP7bvCYACFmPv72CToDC9Bgt6lyL0W9OIWNN/JBbPWJIwJubrMD6x300MSupseB8m9/uchA3c7gDGOJ3+3mM5iNzbD7bNs4E6lzezU8eSy3J+0sZrJxfTwczpbDMn6o7ckLERaOsjsvgPnJDZOIZrLH4kn0UjbExAKQ==$MTkTYp6Lf4oKAzNlW7IV56B3i0vMW5rQ+DpqstPfBNAnrnSLwtN457ETM9ghqWkvSYUJrn+vYIiOeyzxqiHL8ZvXtXUM+wwkXR0HuW+bImT7k3mZ/S1hGlAEpzQYupt8AoxgyZrYuSrxeOwbPeNTPBwrSZ9K3eAd3W3VvxGDnpcsnprOmnORR9p1SB8k8PzxvSSxBuQiTyd2l3CClxqiSRpE6avk165JGurN41y9m3U6liRfMW8fJJyRtDlgHBmYMQ/a+P+HgHkTDu6TUqIFaKOa7TkPT+cn4I+cBBZsSnVFQmEJmRkTeWFYFv92azAHtpChF4zQsJGD2Ao3d1UwuqsPD0Y2Gr+uEGlm5QdAESV1qXo2Mxsxf+PzejC1YaVLUvGD+3tu3G2Z+VeoqKUQphl2iC3q+dv42vC/DQ==","brand":"visa"},"browserInfo":{"acceptHeader":"*/*","colorDepth":24,"language":"en-US","javaEnabled":false,"screenHeight":1024,"screenWidth":1280,"userAgent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.50 Safari/537.36","timeZoneOffset":-480},"origin":"http://localhost:4000","returnUrl":"http://localhost:4000/checkout.html","redirectFromIssuerMethod":"GET"}
    ```

    Response Body   
    ```js
    {"{"paymentId":"6034cd86-2ac9-45d8-8905-35b38035ef98","pspReference":"882609828909879A","status":"AcceptedSettlementInProcess"}"}
    ```

2. Card with 3D secure <a id="card3d"></a>

  Init payment `POST /payments`   
    Request Body:
    ```
    {}
    ```
    Response Body   
    ```
    {}
    ```

 Complete payment `POST /payments/details`   
    Request Body:
    ```
    {}
    ```
    Response Body   
    ```
    {}
    ```

3. Poli <a id="poli"></a>
 Init payment `POST /payments`   
    Request Body:
    ```
    {}
    ```
    Response Body   
    ```
    {}
    ```

 Complete payment `POST /payments/details`   
    Request Body:
    ```
    {}
    ```
    Response Body   
    ```
    {}
    ```


4. Paypal <a id="paypal"></a>
 Init payment `POST /payments`   
    Request Body:
    ```
    {}
    ```
    Response Body   
    ```
    {}
    ```

 Complete payment `POST /payments/details`   
    Request Body:
    ```
    {}
    ```
    Response Body   
    ```
    {}
    ```


