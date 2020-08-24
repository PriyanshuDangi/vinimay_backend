import React, { Component } from "react";
import { connect } from "react-redux";
import styleClasses from "./MyProducts.module.css";
import Axios from "axios";
import Spinner from "../../components/UI/Spinner/Spinner";
import Products from "../../components/Products/Products";
import { NavLink } from "react-router-dom";

class MyProducts extends Component {
  state = {
    products: {},
    loading: true,
    error: null,
  };
  componentDidMount = () => {
    Axios.get("/api/product/myproducts", {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((response) => {
        console.log(response);
        this.setState({
          products: response.data.products,
          error: null,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
          error: error.response.data.error,
        });
      });
  };
  render() {
    let content;
    if (this.state.loading) {
      content = <Spinner />;
    }
    if (Object.entries(this.state.products).length !== 0) {
      content = (
        <div>
          <div className={styleClasses.Heading}>
            <h1>My Products</h1>
          </div>
          <div>
            <Products products={this.state.products} />
          </div>
        </div>
      );
    }
    if (
      !this.state.loading &&
      !this.state.error &&
      Object.entries(this.state.products).length === 0
    ) {
      content = (
        <div className={styleClasses.Error}>
          <div>
            <b>Please post some products to sell</b>
          </div>
          <div>
            <NavLink to="/post">
              <div className={styleClasses.Sell}>
                <i className="fa fa-camera" aria-hidden="true"></i> SELL
              </div>
            </NavLink>
          </div>
        </div>
      );
    }
    if (this.state.error) {
      content = (
        <div className={styleClasses.Error}>
          <b>Unable to get products</b>
        </div>
      );
    }
    return <div className={styleClasses.Main}>{content}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(MyProducts);
