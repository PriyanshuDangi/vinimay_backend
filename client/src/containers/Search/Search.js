import React, { Component } from "react";
import Carousel from "../../components/Carousel/Carousel";
import Products from "../../components/Products/Products";
import styleClasses from "./Search.module.css";
import axios from "axios";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";

class Search extends Component {
  state = {
    products: [],
    loading: true,
    error: null,
    limit: 12,
    skip: 0,
    currentPage: 1,
    totalPage: null,
    string: "",
  };

  componentDidMount = () => {
    var urlParams = new URLSearchParams(this.props.location.search);
    console.log(urlParams.get("string"));
    this.setState({
      string: urlParams.get("string"),
    });
    // if (!urlParams.get("string")) {
    //   console.log("not found");
    //   return
    // }
    this.sendSearchRequest();
  };

  sendSearchRequest = () => {
    var urlParams = new URLSearchParams(this.props.location.search);
    axios
      .get("api/product/search?string=" + urlParams.get("string"), {
        headers: {
          Authorization: "Bearer " + this.props.token,
        },
      })
      .then((response) => {
        this.setState({
          products: response.data.products,
          totalPage: response.data.totalPage,
          error: null,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          error: error.response.data.error,
          loading: false,
        });
      });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.string !== prevState.string) {
      this.sendSearchRequest();
    }
  };

  render() {
    var urlParams = new URLSearchParams(this.props.location.search);
    if (urlParams.get("string") !== this.state.string) {
      this.setState({
        string: urlParams.get("string"),
      });
    }
    let products = (
      <React.Fragment>
        <Products products={this.state.products} />
      </React.Fragment>
    );
    if (this.state.products.length === 0) {
      products = (
        <div className={styleClasses.No_Product}>
          <p>Sorry, no product found.</p>
          <p>Please try another search.</p>
        </div>
      );
    }
    if (this.state.loading) {
      products = <Spinner />;
    }

    return <div>{products}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(Search);
