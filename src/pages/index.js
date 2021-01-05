import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import AdyenCheckout from '@adyen/adyen-web';

import '@adyen/adyen-web/dist/adyen.css';



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

const getPaymmentMethod = async ()=> {
  let resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/paymentMethods?documentId=${process.env.REACT_APP_DOCUMENT_ID}&documentType=${process.env.REACT_APP_DOCUMENT_TYPE}`)
  return resp.data
}

const makeDetailsCall = async (data) => {
  let resp = await axios.post(`${process.env.REACT_APP_BASE_URL}/payments/details`, data)
  return resp.data
}

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
                localStorage.setItem('paymentId', response.paymentId)
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


 class AdyenDropin extends React.Component {
  constructor(props){
      super(props)
      this.checkout = {}
    }

    async componentDidMount() {
       let paymentMethodsResponse = await getPaymmentMethod()
       configuration.paymentMethodsResponse = paymentMethodsResponse
       configuration.paymentMethodsConfiguration = paymentMethodsResponse.paymentMethodsConfiguration

        const checkout = new AdyenCheckout(configuration)
        const dropin = checkout.create('dropin').mount('#dropin-container')
    }

    render() {
      return <div id="dropin-container"></div>
    }
  }




ReactDOM.render(<AdyenDropin />, document.getElementById('root'));
