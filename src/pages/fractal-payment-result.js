import React from 'react';
import ReactDOM from 'react-dom';
import * as QueryString from "query-string"
import axios from 'axios';



const  defaultPaymentId ='5a1d8fa0-1cf0-46fc-ac00-a3b78837162b'

const  obtainToken = async () => {
  let bodyFormData = new URLSearchParams()

  bodyFormData.append('grant_type', 'password')
  bodyFormData.append('username', 'tuan+member@101digital.io')
  bodyFormData.append('password', '123456')
  bodyFormData.append('scope', 'openid')

  let resp =
    await axios.post('https://sandbox.101digital.io/token', bodyFormData,
        {headers:{
           "Content-Type": "application/x-www-form-urlencoded",
           "Authorization": "Basic a1dCTV9PZVB6Z181Z0lmZ3RXRjRtaWlmeDJvYToyMHU2MVdVTXY3WHZGWmdHQlpPRXdKc3pTV1Fh"
          }})
   return resp.data.access_token;
}


const completePayment = async (params) => {


  let data = {
    "Data": {
        "Initiation": {
            "SupplementaryData": {
                "CustomFields": [
                    {
                        "Key": "code",
                        "Value": params['code']
                    },
                    {
                        "Key": "idToken",
                        "Value": params['idToken']
                    },
                    {
                        "Key": "state",
                        "Value": params['state']
                    },
                    {
                        "Key": "bankId",
                        "Value":params['params']
                    }
                ]
            }
        }
    }
}

  let paymentId  = params['paymentId']? params['paymentId'] : defaultPaymentId

  let accessToken = await obtainToken()

  try {
   let resp =
    await axios.patch(`https://sandbox.101digital.io/payment-service/1.0.5/payments/${paymentId}`, data,
        {
          headers:{
           "Content-Type": "application/json",
           "Authorization": `Bearer ${accessToken}`
          }})


    return JSON.stringify(resp.data, null, 4)
  } catch (e) {
     console.log(e.response.data)
     return JSON.stringify(e.response.data, null, 4)
  }

}


export default class FractalCheckout extends React.Component {

  constructor(props){
      super(props)
      this.checkout = {}
      this.state = {message:''}

    }

    async componentDidMount() {
        const params = QueryString.parse(window.location.search)
        console.log(params)

        let data = await  completePayment(params)
        this.setState({ message: data});

    }

    render() {
      return <div>
        <h1>Payment Result</h1>
        <xmp>{this.state.message}</xmp>
      </div>
    }

  }


ReactDOM.render(<FractalCheckout />, document.getElementById('root'));
