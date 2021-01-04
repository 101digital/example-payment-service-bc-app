import React from 'react';
import ReactDOM from 'react-dom';
import * as QueryString from "query-string"
import axios from 'axios';


const buildPaymentDetailData = (params) => {

  let paymentId = `${params['domesticPaymentId']}`
  let localInstrument = null //`${params['localInstrument']}`

  delete params['domesticPaymentId']
  delete params['localInstrument']

  let details = {}

  Object.keys(params).forEach(key => {
   details[key] = params[key]
  })


  return {
    paymentId,
    localInstrument,
    details}
}




export default class Checkout extends React.Component {

  constructor(props){
      super(props)
      this.checkout = {}
      this.state = {message:''}

    }

    async componentDidMount() {
        const params = QueryString.parse(window.location.search)


        if (params['resultCode'] === 'authorised') {
          this.setState({ message: 'Payment successful!' });
        }


        this.setState({ message: 'Processing ...' });

        try {
          let resp = await axios.post('http://localhost:4000/api/payments/details',
             buildPaymentDetailData(params))

          console.log(resp)
          this.setState({ message: `Payment Status: ${resp.data.status}` });
        } catch (e) {
          console.error(e)
          this.setState({ message: 'ERROR'});
        }

    }

    render() {
      return <div id="dropin-container">
        <h1>{this.state.message}</h1>
      </div>
    }

  }


ReactDOM.render(<Checkout />, document.getElementById('root'));
