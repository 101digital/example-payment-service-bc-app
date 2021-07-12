import React from 'react';
import * as QueryString from "query-string"
import axios from 'axios'
import env from '../../env'


const obtainToken = (code)=> {

  var data = QueryString.stringify({
    "grant_type": "authorization_code",
    "code": code,
    "redirect_uri": `${localStorage.getItem('oauth2-callback')}`,
    "client_id": `${env.get('CLIENT_ID')}`,
    "client_secret": `${env.get('CLIENT_SECRET')}`
    })

    axios.post(`${env.get('TOKEN_ENDPOINT')}`, data,
                                                              {headers: {
                                                                "Content-Type": "application/x-www-form-urlencoded"
                                              }})
          .then(resp => {
            localStorage.setItem('access_token', resp.data.access_token)
            localStorage.setItem('access_token', resp.data.access_token);
            localStorage.setItem('instanceUrl', resp.data.instance_url);
            window.location.href =`${env.get('HOME_PAGE')}`
          })
}

const AuthComponent = () => {
  const query = QueryString.parse(window.location.search)
  if (query.code) {
    obtainToken(query.code)

    //products

  } else {
      localStorage.setItem('oauth2-callback', `${window.location.href}`)
      window.location.href = `${env.get('AUTHORAZION_URL')}?redirect_uri=${window.location.href}&client_id=${env.get('CLIENT_ID')}&response_type=code`
  }


  return <div>Authenticating ..</div>
};

export default AuthComponent;
