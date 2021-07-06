import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import * as QueryString from "query-string"
import AdyenCheckout from '@adyen/adyen-web';

import '@adyen/adyen-web/dist/adyen.css';


const cleanUrl = (uri)=> {
  if (uri.indexOf("?") > 0) {
   return uri.substring(0, uri.indexOf("?"))
  } else {
    return uri
  }
}

const buildPaymentDetailData = (params) => {

  let paymentId = `${params['paymentId']}`
  delete params['paymentId']
  delete params['resultCode']

  return {
    paymentId,
    details: params}
}

const extracResourceId = (jwt) => {
  try {

    return JSON.parse(Buffer.from(jwt.split('.')[1],'base64').toString('ascii')).resourceId

  } catch (e) {
    throw new Error("Invalid invoice share key");
  }
}



const getPaymmentMethod = async(paymentBaseUrl, resourceId, invoiceSharedKey)=> {
  let headers = {headers: {'customerContextId': invoiceSharedKey}}
  let resp = await axios.get(`${paymentBaseUrl}/paymentMethods?documentId=${resourceId}`, headers)
  return resp.data
}



const buildConfiguration = (webDropin) =>  {
  let {invoiceSharedKey,
       paymentBaseUrl,
       resourceId,
       apiKey,
       onPaymentComplete,
       environment} = webDropin.props

  let  paymentMethodsResponse = webDropin.paymentMethodsResponse
  const paymentCallback = webDropin.paymentCallback

  let headers = {headers: {'customerContextId': invoiceSharedKey}}
  let {paymentMethodsConfiguration} = paymentMethodsResponse



  const makePayment = async (state) => {

    let resp = await axios.post(`${paymentBaseUrl}/payments`, {
      documentId: resourceId,
      documentType: process.env.REACT_APP_DOCUMENT_TYPE,
      paymentMethod: state.data.paymentMethod,
      browserInfo: state.data.browserInfo,
      origin: window.location.origin,
      returnUrl: cleanUrl(window.location.href),
      redirectFromIssuerMethod: 'GET'
    }, headers)

    return resp.data

  }


  const makeDetailsCall = async (data) => {
    let resp = await axios.post(`${paymentBaseUrl}/payments/details`, data, headers)
    return resp.data
  }


  return {
    paymentMethodsResponse,
    paymentMethodsConfiguration: paymentMethodsConfiguration,
    clientKey: apiKey,
    locale: "en-US",
    environment: environment,
    onSubmit: (state, dropin) => {
        console.log(state)

        makePayment(state)
          .then(response => {
            if (response.paymentId) {
                localStorage.setItem('paymentId', response.paymentId)
            }
            console.log(response)

            if (response.action) {
              dropin.handleAction(response.action);
            } else {
              paymentCallback({success: true, result: response})
              dropin.setStatus('success', { message: 'Payment successful!' });
            }
          })
          .catch(error => {
            paymentCallback({success: false, error})
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

            dropin.handleAction(response.action);
          } else {
            paymentCallback({success: true, result: response})
            dropin.setStatus('success', { message: 'Payment status: ' + response.status });
          }
        })
        .catch(error => {
          paymentCallback({success: false, error})
          throw Error(error);
        });
      }
    },
    onError(error) {
      console.error(error)
    }
   };
}

 class AdyenDropin extends React.Component {

  constructor(props){
      super(props)
      this.dropin = null
      this.paymentMethodsResponse = {}
      this.handleCallback = this.handleCallback.bind(this)
      this.paymentCallback = this.paymentCallback.bind(this)
    }

    paymentCallback(result) {
      if (this.props.onPaymentComplete && typeof window[this.props.onPaymentComplete] == 'function' ) {
         window[this.props.onPaymentComplete].apply(this, [result])
      }
    }

    handleCallback(params) {
        axios.post(`${this.props.paymentBaseUrl}/payments/details`,
          buildPaymentDetailData(params)).then(resp => {
            this.paymentCallback({success: true, result: resp.data})

          }).catch(error => {
            console.error(error)
            this.paymentCallback({success: false,error})
          })

    }

    async componentDidMount() {

      const params = QueryString.parse(window.location.search)
      let {paymentBaseUrl,
        invoiceSharedKey,
        resourceId} = this.props


      if (params['resultCode'] || params['paymentId']) {
         this.handleCallback(params)
      } else {
       this.paymentMethodsResponse = await getPaymmentMethod(paymentBaseUrl, resourceId, invoiceSharedKey)
       let configuration = buildConfiguration(this)
       const checkout = new AdyenCheckout(configuration)
       this.dropin = checkout.create('dropin').mount('#dropin-container')
       }
    }

    render() {
      return <div id="dropin-container"></div>
    }
  }



let dropInEl = document.getElementById('webdropIn')
let invoiceSharedKey = dropInEl.getAttribute('invoice-share-key')
let resourceId = extracResourceId(invoiceSharedKey)
let paymentBaseUrl = dropInEl.getAttribute('payment-base-url')
let apiKey = dropInEl.getAttribute('api-key')
let onPaymentComplete = dropInEl.getAttribute('on-payment-complete')
let environment = dropInEl.getAttribute('environment') || 'test'



ReactDOM.render(<AdyenDropin  invoiceSharedKey = {invoiceSharedKey}
                              paymentBaseUrl = {paymentBaseUrl}
                              resourceId = {resourceId}
                              apiKey = {apiKey}
                              onPaymentComplete = {onPaymentComplete}
                              environment = {environment}
                              />, dropInEl)
