import React from 'react';
import ReactDOM from 'react-dom';
import * as QueryString from "query-string"
import axios from 'axios';


const buildPaymentDetailData = (params) => {

  let md = params['MD']
  let paRes =  params['PaRes']

  return {
    "Data": {
      "Initiation": {
        "RequestedDateTime": "2017-06-05T15:15:13.234Z",
        "SupplementaryData": {
          "CustomFields": [
            {
              "Key":"MD",
              "Value": md
           },
           {
              "Key":"PaRes",
              "Value": paRes
           }
          ]
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
        if (params['resultCode'] === 'authorised') {
          this.setState({ message: 'Payment successful!' });
        }


        let resp = await axios.patch('http://localhost:4000/api/payments/' + localStorage.getItem('DomesticPaymentId'),
           buildPaymentDetailData(params))

        console.log(resp)
        this.setState({ message: `Payment Status: ${resp.Data.Status}` });

        return Promise.resolve()
    }

    render() {
      return <div id="dropin-container">
        <h1>{this.state.message}</h1>
      </div>
    }

  }


ReactDOM.render(<Checkout />, document.getElementById('root'));
