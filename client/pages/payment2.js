import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import AdyenCheckout from '@adyen/adyen-web';

import '@adyen/adyen-web/dist/adyen.css';


const REACT_APP_ADYEN_API_KEY= 'test_DWLVOLS6WFD2LPYG4RFAGVM5OIHTWPNH'

const defaultBrowserInfo = {
  acceptHeader: "*/*",
  colorDepth: "24",
  language: "en-US",
  javaEnabled: "false",
  screenHeight: "768",
  screenWidth: "1366",
  userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.50 Safari/537.36",
  timeZoneOffset: "-480"
}

//const paymentMethodsResponse = {"groups":[{"name":"Credit Card","types":["amex","jcb","mc","visa"]}],"paymentMethods":[{"brands":["amex","jcb","mc","visa"],"details":[{"key":"encryptedCardNumber","type":"cardToken"},{"key":"encryptedSecurityCode","type":"cardToken"},{"key":"encryptedExpiryMonth","type":"cardToken"},{"key":"encryptedExpiryYear","type":"cardToken"},{"key":"holderName","optional":true,"type":"text"}],"name":"Credit Card","type":"scheme"},{"name":"7-Eleven","supportsRecurring":true,"type":"molpay_cash"},{"name":"epay","supportsRecurring":true,"type":"molpay_epay"},{"configuration":{"intent":"capture"},"name":"PayPal","supportsRecurring":true,"type":"paypal"},{"name":"POLi","supportsRecurring":true,"type":"poli"},{"name":"UnionPay","supportsRecurring":true,"type":"unionpay"}]}
//const paymentMethodsResponse = {"paymentMethods":[{"brands":["amex","jcb","mc","visa"],"details":[{"key":"encryptedCardNumber","type":"cardToken"},{"key":"encryptedSecurityCode","type":"cardToken"},{"key":"encryptedExpiryMonth","type":"cardToken"},{"key":"encryptedExpiryYear","type":"cardToken"},{"key":"holderName","optional":true,"type":"text"}],"name":"Credit Card","type":"scheme"},{"name":"7-Eleven","supportsRecurring":true,"type":"molpay_cash"},{"name":"epay","supportsRecurring":true,"type":"molpay_epay"},{"configuration":{"intent":"capture"},"name":"PayPal","supportsRecurring":true,"type":"paypal"},{"name":"POLi","supportsRecurring":true,"type":"poli"},{"name":"UnionPay","supportsRecurring":true,"type":"unionpay"}]}

const makePayment = async (state) => {

  let browserInfo =  state.data.browserInfo;
  if (browserInfo) {
    Object.keys(state.data.browserInfo).forEach(key => browserInfo[key] = `${browserInfo[key]}`)
  } else {
    browserInfo = defaultBrowserInfo
  }


  let resp = await axios.post('http://localhost:4000/api/payments',
  {
    documentId: "dkjJHFJ87238476FDG",
    documentType: "INVOICE",
    paymentMethod: state.data.paymentMethod,
    browserInfo: browserInfo,
    origin: window.location.origin,
    returnUrl: "http://localhost:4000/checkout2.html",
    redirectFromIssuerMethod: 'GET'
  })

  return resp.data

}

const getPaymmentMethod = async ()=> {
  let resp = await axios.get(`http://localhost:4000/api/paymentMethods?documentId=dkjJHFJ87238476FDG&documentType=INVOICE`)
  return resp.data
}

const makeDetailsCall = async (data) => {
  let resp = await axios.post('http://localhost:4000/api/payments/details', data)
  return resp.data
}

const configuration = {
    paymentMethodsResponse: {}, // The `/paymentMethods` response from the server.
    clientKey: REACT_APP_ADYEN_API_KEY , // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
    locale: "en-US",
    environment: "test",
    onSubmit: (state, dropin) => {

        // Your function calling your server to make the `/payments` request
        makePayment(state)
          .then(response => {
            if (response.paymentId) {
                localStorage.setItem('paymentId', response.paymentId)
            }

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
    },
    paymentMethodsConfiguration: {
      card: { // Example optional configuration for Cards
        hasHolderName: true,
        holderNameRequired: true,
        enableStoreDetails: true,
        hideCVC: false, // Change this to true to hide the CVC field for stored cards
        name: 'Credit or debit card'
      },
      paypal: {
        environment: 'test',
        countryCode: 'NL',
        amount: {
          currency: 'AUD',
          value: 200
        },
        intent: 'capture',
        onCancel: (data, dropin) => {
          console.log(data)
          dropin.setStatus('ready')
        },
      },
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

        const checkout = new AdyenCheckout(configuration)
        const dropin = checkout.create('dropin').mount('#dropin-container')
    }

    render() {
      return <div id="dropin-container"></div>
    }
  }




ReactDOM.render(<AdyenDropin />, document.getElementById('root'));
