import axios from 'axios';
import cookie from 'react-cookies';

const buildPaymentData = (state, customFields) => {

  return {
  "Data": {
    "Initiation": {
      "EndToEndIdentification": "90000246_1606899633",
      "LocalInstrument": "CARDPAYMENT",
      "RequestedDateTime": "2017-06-05T15:15:13.234Z",
      "InstructedAmount": {
        "Amount": 200,
        "Currency": "AUD"
      },
      "DebtorAccount": {
        "SchemeName": "CARD_PAYMENT",
        "Name": state.data.paymentMethod.holderName,
        "SecondaryIdentification": "SAPCustomerNumber_123"
      },
      "DebtorAccountExt": {
        "NameOnTheCard": state.data.paymentMethod.holderName,
        "EncryptedCardNumber": state.data.paymentMethod.encryptedCardNumber,
        "EncryptedExpiryMonth": state.data.paymentMethod.encryptedExpiryMonth,
        "EncryptedExpiryYear": state.data.paymentMethod.encryptedExpiryYear,
        "EncryptedSecurityCode":state.data.paymentMethod.encryptedSecurityCode
      },
      "RemittanceInformation": {
        "Reference": "900035789"
      },
      "SupplementaryData": {
        "CustomFields": customFields
      }
    }
  }
}
}


const browserInfo = [
  {
    "Key":"AcceptHeader",
    "Value":"*/*"
 },
 {
    "Key":"ColorDepth",
    "Value":"24"
 },
 {
    "Key":"Language",
    "Value":"en-US"
 },
 {
    "Key":"JavaEnabled",
    "Value":"false"
 },
 {
    "Key":"ScreenHeight",
    "Value":"800"
 },
 {
    "Key":"ScreenWidth",
    "Value":"1280"
 },
 {
    "Key":"UserAgent",
    "Value":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
 },
 {
    "Key":"TimeZoneOffset",
    "Value":"-420"
 }
]


const buildPaypalData = (state, paymentType ) => {

  return {
  "Data": {
    "Initiation": {
      "EndToEndIdentification": "90000246_1606899633",
      "LocalInstrument": paymentType,
      "RequestedDateTime": "2017-06-05T15:15:13.234Z",
      "InstructedAmount": {
        "Amount": 200,
        "Currency": "AUD"
      },
      "DebtorAccount": {
        "SchemeName": paymentType,
        "SecondaryIdentification": "SAPCustomerNumber_123"
      },
      "RemittanceInformation": {
        "Reference": "900035789"
      },
      "SupplementaryData": {
        "CustomFields":[
          {
            "Key":"Origin",
            "Value":"http://localhost:4000"
         },
         {
            "Key":"RedirectFromIssuerMethod",
            "Value":"GET"
         },
          {
             "Key":"ReturnUrl",
             "Value":"http://localhost:4000/checkout.html"
          },
          {
             "Key":"ShopperEmail",
             "Value":"xuan@101digital.io"
          },
          {
             "Key":"AcceptHeader",
             "Value":"*/*"
          },
          {
             "Key":"ColorDepth",
             "Value":"24"
          },
          {
             "Key":"Language",
             "Value":"en-US"
          },
          {
             "Key":"JavaEnabled",
             "Value":"false"
          },
          {
             "Key":"ScreenHeight",
             "Value":"800"
          },
          {
             "Key":"ScreenWidth",
             "Value":"1280"
          },
          {
             "Key":"UserAgent",
             "Value":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
          },
          {
             "Key":"TimeZoneOffset",
             "Value":"-420"
          }
       ]
      }
    }
  }
}
}


const extraCustomFields = [
  {
    "Key":"Origin",
    "Value":"http://localhost:4000"
 },
 {
    "Key":"RedirectFromIssuerMethod",
    "Value":"GET"
 },
 {
    "Key":"ReturnUrl",
    "Value":"http://localhost:4000/checkout.html"
 },
]


const propExists = (obj, path) => {
  return !!path.split(".").reduce((obj, prop) => {
      return obj && obj[prop] ? obj[prop] : undefined;
  }, obj)
}


const  capitalize = (s) =>
{
    return s[0].toUpperCase() + s.slice(1);
}

export const makePayment =  async (state) => {
  // console.log(state)
  // console.log(state.data.paymentMethod)
  if (state.data.riskData) {
   let encryptData = state.data.riskData.clientData
   let buff = Buffer.from(encryptData, 'base64');
   let riskData =  JSON.parse(buff.toString('ascii'))
  }

  let browserInfo = state.data.browserInfo

  console.log(JSON.stringify(browserInfo))


  if (state.data.paymentMethod.encryptedCardNumber && browserInfo) {
    let customFields =
      Object.keys(browserInfo).map(key => ({Key: capitalize(key), Value: `${browserInfo[key]}`}))

     let resp = await axios.post('http://localhost:4000/api/payments',
      buildPaymentData(state, customFields.concat(extraCustomFields)))

     if (propExists(resp,'data.Data.Initiation.SupplementaryData.CustomFields')) {
      let actions = resp.data.Data.Initiation.SupplementaryData.CustomFields.filter(e=>e.Key=='adyen-action')
      if (actions[0]) {
        let data = JSON.parse(actions[0].Value)
        resp.action = data
        console.log(data)

        localStorage.setItem('data', JSON.stringify(data))
        localStorage.setItem('DomesticPaymentId', resp.data.Data.DomesticPaymentId)

        return {action: data}
      }

     }


     return resp.data
  }

  if ('paypal' === state.data.paymentMethod.type) {
    let resp =  await axios.post('http://localhost:4000/api/payments', buildPaypalData(state, 'PAYPAL'))
    if (propExists(resp,'data.Data.Initiation.SupplementaryData.CustomFields')) {
      let actions = resp.data.Data.Initiation.SupplementaryData.CustomFields.filter(e=>e.Key=='adyen-action')
      console.log(actions)
      if (actions[0]) {
        let data = JSON.parse(actions[0].Value)
        resp.action = data
        console.log(data)
        localStorage.setItem('data', JSON.stringify(data))
       // cookie.save('payment_data', data.paymentData, { path: '/', domain: 'localhost:4000' });

        return {action: data, paymentData: data.paymentData}
      }

     }

     return resp.data
  }


  if ('poli' === state.data.paymentMethod.type) {
    let resp =  await axios.post('http://localhost:4000/api/payments', buildPaypalData(state, 'POLI'))
    if (propExists(resp,'data.Data.Initiation.SupplementaryData.CustomFields')) {
      let actions = resp.data.Data.Initiation.SupplementaryData.CustomFields.filter(e=>e.Key=='adyen-action')
      console.log(actions)
      if (actions[0]) {
        let data = JSON.parse(actions[0].Value)
        resp.action = data
        console.log(data)
        localStorage.setItem('data', JSON.stringify(data))
       // cookie.save('payment_data', data.paymentData, { path: '/', domain: 'localhost:4000' });

        return {action: data, paymentData: data.paymentData}
      }

     }

     return resp.data
  }

  console.log(state)

  return state
}