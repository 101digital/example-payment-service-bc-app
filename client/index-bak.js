import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

import AdyenCheckout from '@adyen/adyen-web';

import '@adyen/adyen-web/dist/adyen.css';

import {makePayment} from './components/PaymentApi.jsx'


const REACT_APP_ADYEN_API_KEY= 'test_DWLVOLS6WFD2LPYG4RFAGVM5OIHTWPNH'


const paymentMethodsResponse = {"groups":[{"name":"Credit Card","types":["amex","jcb","mc","visa"]}],"paymentMethods":[{"brands":["amex","jcb","mc","visa"],"details":[{"key":"encryptedCardNumber","type":"cardToken"},{"key":"encryptedSecurityCode","type":"cardToken"},{"key":"encryptedExpiryMonth","type":"cardToken"},{"key":"encryptedExpiryYear","type":"cardToken"},{"key":"holderName","optional":true,"type":"text"}],"name":"Credit Card","type":"scheme"},{"name":"7-Eleven","supportsRecurring":true,"type":"molpay_cash"},{"name":"epay","supportsRecurring":true,"type":"molpay_epay"},{"configuration":{"intent":"capture"},"name":"PayPal","supportsRecurring":true,"type":"paypal"},{"name":"POLi","supportsRecurring":true,"type":"poli"},{"name":"UnionPay","supportsRecurring":true,"type":"unionpay"}]}

const configuration = {
    paymentMethodsResponse: paymentMethodsResponse, // The `/paymentMethods` response from the server.
    clientKey: REACT_APP_ADYEN_API_KEY , // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
    locale: "en-US",
    environment: "test",
    onSubmit: (state, dropin) => {

        // Your function calling your server to make the `/payments` request
        makePayment(state)
          .then(response => {

            if (response.action) {
              // Drop-in handles the action object from the /payments response
              dropin.handleAction(response.action);
            } else {
              console.log(response.data)
              //alert('payment success')

              //showFinalResult(response);
            }
          })
          .catch(error => {
            throw Error(error);
          });
      },
    onAdditionalDetails: (state, dropin) => {
      console.log(state)
      // Your function calling your server to make a `/payments/details` request
      // makeDetailsCall(state.data)
      //   .then(response => {
      //     if (response.action) {
      //       // Drop-in handles the action object from the /payments response
      //       dropin.handleAction(response.action);
      //     } else {
      //       // Your function to show the final result to the shopper
      //       showFinalResult(response);
      //     }
      //   })
      //   .catch(error => {
      //     throw Error(error);
      //   });
    },
    paymentMethodsConfiguration: {
      card: { // Example optional configuration for Cards
        hasHolderName: true,
        holderNameRequired: true,
        enableStoreDetails: true,
        hideCVC: false, // Change this to true to hide the CVC field for stored cards
        name: 'Credit or debit card'
      }
    }
   };

   const checkout = new AdyenCheckout(configuration);

const dropin = checkout.create('dropin').mount('#dropin-container');

ReactDOM.render(<App />, document.getElementById('root'));
