import React, { useEffect, useState } from 'react';
import './Product.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Logo from '../../../../assets/images/logo.svg';
import productService from '../../services/product-service';
const ProductComponent = () => {
  const [productList, setProductList] = useState(undefined);
  useEffect(() => {
    if (!productList) {
      const data = getProduct();
      setProductList(data);
    }
  }, [productList]);

  const getProduct = () => {
    const productData = productService.getProducts();
    return productData;
  };

  const renderProduct = () => {
    let html;
    if (productList) {
      console.log(productList.data);
      html = productList.data.map((product) => {
        return (
          <div className="products-list">
            <div className="heading">
              <div className="product-name">{product.Name}</div>
              <div className="product-function"></div>
            </div>
            <div className="product-number">
              <label>Product number: </label>
              <span className="result-number">&nbsp;&nbsp;{product.ProductId__c}</span>
              <div className="product-tags">
                <span className="tag">HZ</span>
                <span className="tag">DG</span>
              </div>
            </div>
            <div>
              <Container>
                <Row>
                  <Col>
                    <label>Your product number</label>
                  </Col>
                  <Col>
                    <label>Pack</label>
                  </Col>
                  <Col>
                    <label>Pack size</label>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <span className="result-number">{product.ProductId__c || '-'}</span>
                  </Col>
                  <Col>
                    <span className="result-number">{product.Pack_Type__c || '-'}</span>
                  </Col>
                  <Col>
                    <span className="result-number">
                      {product.Pack_Size__c || '-'} {product.Pack_Unit__c}
                    </span>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        );
      });
    }
    return html;
  };

  return (
    <React.Fragment>
      <div className="">
        <div className="header">
          <img className="logo" src={Logo} alt="logo"></img>
          <span className="profile">My profile</span>
        </div>
        <div className="menu"></div>
        <div className="products">
          <div className="products-title">
            <div className="product-heading">Products</div>
            <div className="product-item-count">
              {productList ? productList.totalRecords : 0} Items
            </div>
          </div>
          <div className="products-filter">
            <input placeholder="Search product name" />
          </div>
          {renderProduct()}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductComponent;
