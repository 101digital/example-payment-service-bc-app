import React from 'react';
import ReactDOM from 'react-dom';
import * as QueryString from "query-string"
import axios from 'axios';


const buildPaymentDetailData = (params) => {

  let paymentId = `${params['paymentId']}`
  delete params['paymentId']
  delete params['resultCode']

  return {
    paymentId,
    details: params}
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
          let resp = await axios.post(`${process.env.REACT_APP_BASE_URL}/payments/details`,
             buildPaymentDetailData(params))

          console.log(resp.data)
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
