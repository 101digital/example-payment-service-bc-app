import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Router, Redirect } from '@reach/router';
import AuthComponent from './js/components/Auth/Auth';
import ProductComponent from './js/components/Product/Product';

const App = () => {
  return (
    <Router>
      <ProductComponent path="products" />

      <AuthComponent path="auth/login" />
      <Redirect noThrow from="*" to="auth/login" />
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
