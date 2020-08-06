import React, { Component } from "react";
import { connect } from "react-redux";
import styleClasses from "./MyProducts.module.css";
import Axios from "axios";
import Spinner from "../../components/UI/Spinner/Spinner";
import Products from "../../components/Products/Products";

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
      content = <Products products={this.state.products} />;
    }
    if (this.state.error) {
      content = <p>Unable to get products</p>;
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
