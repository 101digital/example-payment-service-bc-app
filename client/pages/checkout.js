import React from 'react';
import ReactDOM from 'react-dom';
import * as QueryString from "query-string"
import axios from 'axios';


const buildPaymentDetailData = (params, localInstrument) => {

 let customFields =
  Object.keys(params).map(key => ({
    "Key": key,
    "Value": params[key]
 }))


  return {
    "Data": {
      "Initiation": {
        "LocalInstrument": localInstrument,
        "RequestedDateTime": "2017-06-05T15:15:13.234Z",
        "SupplementaryData": {
          "CustomFields": customFields
      }
    }
  }
}
}


export default class Checkout extends React.Component {

  constructor(props){
      super(props)
      this.checkout = {}
      this.state = {message:''}

    }

    async componentDidMount() {
        const params = QueryString.parse(window.location.search)
        let domesticPaymentId = `${params['domesticPaymentId']}`
        let localInstrument = `${params['localInstrument']}`

        delete params['domesticPaymentId']
        delete params['localInstrument']


        if (params['resultCode'] === 'authorised') {
          this.setState({ message: 'Payment successful!' });
        }


        this.setState({ message: 'Processing ...' });

        try {
          let resp = await axios.patch('http://localhost:4000/api/payments/' + domesticPaymentId,
             buildPaymentDetailData(params, localInstrument))

          console.log(resp)
          this.setState({ message: `Payment Status: ${resp.data.Data.Status}` });
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
