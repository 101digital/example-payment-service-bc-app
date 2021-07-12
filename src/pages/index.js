import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Redirect } from '@reach/router';
import AuthComponent from './js/components/Auth/Auth';
import ProductComponent from './js/components/Product/Product';

const App = () => {
  return (
    <Router>
      <AuthComponent path="auth/login" />
      <ProductComponent path="products" />
      <Redirect noThrow from="*" to="auth/login" />
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
