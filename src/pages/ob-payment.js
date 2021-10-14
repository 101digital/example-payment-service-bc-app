import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';


import ObWebCheckout from '../components/obcheckout';
import '../components/styles.css'

//import ObWebCheckout from 'webcheckout-ob'
//import 'webcheckout-ob/dist/index.css'


const customerContextId = 'eyJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZUlkIjoiZGI1ZjJkYzAtZTVjMS00NzE2LWEzZGItY2I1MDA0YjUzYWEwIiwiaXNzIjoiMTAxRCIsImV4cCI6MTYzNjc3ODk1MywiaHR0cDpcL1wvd3NvMi5vcmdcL2NsYWltc1wvZW50aXR5SWQiOiIxMDFEIn0.pQF4wAY7Z8IoesifzCjxDSfpCEc5sUOE7_4R6HiuRXA'
//'eyJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZUlkIjoiMjFiNjE2YmUtNmE2Yy00NWY4LWIzZjMtMTQxYzJlMzExYmFlIiwiaXNzIjoiMTAxRCIsImV4cCI6MTYzNjcwMzkwNywiaHR0cDpcL1wvd3NvMi5vcmdcL2NsYWltc1wvZW50aXR5SWQiOiIxMDFEIn0.CcdDVenHkNKPUc48JzDWcu_q2IrF6a7gW7pNRN4z-4E'

const makePayment = async (state) => {

  let resp = await axios.post(`${process.env.REACT_APP_BASE_URL}/payments`, {
    documentId: process.env.REACT_APP_DOCUMENT_ID,
    paymentMethod: state.data.paymentMethod,
    returnUrl: "http://localhost:4000/ob-checkout.html"
  },
  {headers:{customerContextId}})

  return resp.data

}

const getPaymmentMethod = async ()=> {
  let resp = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/paymentMethods?documentId=${process.env.REACT_APP_DOCUMENT_ID}`,
    {headers:{customerContextId: customerContextId}})
  return resp.data
}

const makeDetailsCall = async (data) => {
  let resp = await axios.post(`${process.env.REACT_APP_BASE_URL}/payments/details`, data)
  return resp.data
}

const configuration = {
    paymentMethods: [],
    onSubmit: (state, dropin) => {
        console.log(state)
        makePayment(state)
          .then(response => {
            if (response.paymentId) {
                localStorage.setItem('paymentId', response.paymentId)
            }
            console.log(response)

            if (response.action) {
              // Drop-in handles the action object from the /payments response
                console.log(response.action)
                dropin.handleAction(response.action);
            } else {
              dropin.setStatus('success', { message: 'Payment successful!' });

            }
          })
          .catch(error => {
            throw Error(error);
          });
    },
    onError(error) {
      console.error(error)
    }
   };


 class WebPayment extends React.Component {
  constructor(props){
      super(props)
      this.state = {paymentMethods:[]}
    }

    async componentDidMount() {
       let paymentMethodsResponse = await getPaymmentMethod()
       this.setState({paymentMethods: paymentMethodsResponse.paymentMethods})
    }

    render() {
      configuration.paymentMethods = this.state.paymentMethods
      return (
       <div>
        <ObWebCheckout configuration={configuration} />
      </div> )
    }
  }




ReactDOM.render(<WebPayment />, document.getElementById('root'));
