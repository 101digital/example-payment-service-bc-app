import React from 'react';
import ReactDOM from 'react-dom';
import * as QueryString from "query-string"


export default class Checkout extends React.Component {

  constructor(props){
      super(props)
      this.checkout = {}
      this.state = {message:''}

    }

    componentDidMount() {
        const params = QueryString.parse(window.location.search)
        if (params['resultCode'] === 'authorised') {
          this.setState({ message: 'Payment successful!' });
        }


    }

    render() {
      return <div id="dropin-container">
        <h1>{this.state.message}</h1>
      </div>
    }

  }


ReactDOM.render(<Checkout />, document.getElementById('root'));
