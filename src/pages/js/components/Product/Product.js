import React, { useEffect, useState } from 'react';
import './Product.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import productService from '../../services/product-service';
const ProductComponent = () => {
  const [productList, setProductList] = useState(undefined);
  useEffect(() => {
    if (!productList) {
      getProduct().then((result) => {
        setProductList(result);
      });
    }
  }, [productList]);

  const getProduct = () => {
    const productData = productService.getProducts();
    return productData;
  };

  const renderProduct = () => {
    let html;
    if (productList) {
      html = productList.data.map((product, key) => {
        return (
          <div className="products-list" key={`product-${key}`}>
            <div className="heading">
              <div className="product-name">{product.Name}</div>
              <div className="product-function">
                <span className="price">No price available</span>
                <div class="my-button success">Add to cart</div>
                <div class="my-button dark">Detail</div>
                {/* <Button variant="success">Add to cart</Button> */}
                {/* <Button variant="dark">Detail</Button> */}
              </div>
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
          <svg
            width="194"
            height="20"
            viewBox="0 0 290 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M174.672 22.956c-1.051.636-2.478 1.235-4.018 1.235-4.356 0-6.721-3.744-6.721-10.71 0-6.328 2.028-10.747 6.383-10.747 1.465 0 2.892.487 4.093 1.16l.977-2.434c-1.39-.86-3.23-1.385-5.107-1.385-6.196 0-9.688 5.318-9.688 13.743 0 8.426 3.454 13.07 9.538 13.07 2.027 0 3.942-.6 5.369-1.46l-.826-2.472zm21.981-9.662c0-7.939-3.23-13.294-9.576-13.294-6.421 0-9.838 5.542-9.838 13.594 0 8.088 3.192 13.369 9.576 13.369 6.458 0 9.838-5.505 9.838-13.669zm-3.342.337c0 5.655-1.728 10.71-6.309 10.71-4.393 0-6.458-4.419-6.458-11.047 0-5.58 1.727-10.673 6.346-10.673 4.393 0 6.421 4.457 6.421 11.01zm23.865 12.919V.413h-2.817v21.383h-.037l-8.9-21.383h-4.468V26.55h2.816V4.569h.038l9.124 21.982h4.244zm21.598 0V.413h-2.816v21.383h-.037l-8.9-21.383h-4.468V26.55h2.816V4.569h.037l9.125 21.982h4.243zm17.131 0v-2.583h-8.674v-9.812h7.435v-2.509h-7.435V2.958h8.524V.412h-11.603V26.55h11.753zm16.897-3.594c-1.051.636-2.478 1.235-4.018 1.235-4.356 0-6.721-3.744-6.721-10.71 0-6.328 2.028-10.747 6.383-10.747 1.465 0 2.892.487 4.093 1.16l.977-2.434c-1.39-.86-3.23-1.385-5.107-1.385-6.196 0-9.688 5.318-9.688 13.743 0 8.426 3.454 13.07 9.538 13.07 2.027 0 3.942-.6 5.369-1.46l-.826-2.472zM290 2.996V.412h-15.321v2.584h6.083V26.55h3.155V2.996H290z"
              fill="#C03"
            ></path>
            <path
              d="M15.02 18.686c0-3.332-1.765-5.729-4.243-6.253 1.915-.824 3.042-2.734 3.042-5.505 0-4.307-2.704-6.516-7.473-6.516H0V26.55h6.609c4.543 0 8.411-2.397 8.411-7.864zM9.388 7.527c0 2.247-.789 3.82-2.892 3.82H4.281V3.745h1.877c2.253 0 3.23 1.498 3.23 3.782zm1.051 11.384c0 2.771-1.277 4.232-3.492 4.232H4.28v-8.5h2.253c2.741 0 3.905 1.647 3.905 4.268zm23.928 7.639l-5.144-12.282c2.328-.9 4.018-3.071 4.018-6.853 0-4.457-2.891-7.003-7.66-7.003h-6.797V26.55h4.393V15.39h1.916l4.28 11.16h4.994zM28.622 7.865c0 2.36-1.164 4.157-3.605 4.157h-1.84V3.857h1.99c2.63 0 3.455 1.947 3.455 4.007zM49.963 26.55v-3.482h-8.186V14.68h6.947v-3.408h-6.947V3.895h8.074V.412H37.42V26.55h12.542zm21.985 0V.413h-3.83v19.773h-.037L60.458.412h-6.196V26.55h3.868V6.366h.037l7.773 20.185h6.008zm22.562 0V.413h-3.83v19.773h-.038L83.019.412h-6.196V26.55h3.868V6.366h.037l7.773 20.185h6.008zm18.58-22.543V.412H97.431v3.595h5.633V26.55h4.431V4.007h5.595zm18.257 22.543A264.501 264.501 0 00124.401.413h-5.52c-2.741 8.538-5.07 17.039-7.022 26.139h4.431c.375-1.985.863-4.307 1.314-6.404h7.698c.45 2.097.939 4.419 1.314 6.404h4.731zm-13.142-9.848a371.763 371.763 0 012.516-9.737c.187-.786.45-1.722.676-2.471h.037c.188.749.413 1.722.639 2.509.901 3.22 1.802 6.59 2.515 9.699h-6.383zm32.229-14.68C148.407.786 146.191 0 143.563 0c-6.797 0-10.777 5.243-10.777 13.78 0 8.502 3.604 13.22 10.514 13.22 2.516 0 5.069-.524 7.022-1.386V12.657h-4.394v10.186c-.826.262-1.69.45-2.516.45-3.867 0-5.97-3.333-5.97-9.812 0-5.88 1.877-9.811 6.196-9.811 1.877 0 3.68.637 5.444 1.76l1.352-3.408z"
              fill="#040066"
            ></path>
          </svg>
          {/* <img className="logo" src={Logo} alt="logo"></img> */}
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
