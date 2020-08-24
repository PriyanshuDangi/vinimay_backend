import React, { Component } from "react";
import Carousel from "../../components/Carousel/Carousel";
import Products from "../../components/Products/Products";
import olxImage from "../../assets/images/olx.PNG";
import styleClasses from "./Home.module.css";
import axios from "axios";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";

const carouselImages = [
  {
    img: olxImage,
  },
  {
    img: olxImage,
  },
  {
    img: olxImage,
  },
];

class Home extends Component {
  state = {
    products: {},
    loading: true,
    error: null,
    limit: 12,
    skip: 0,
    currentPage: 1,
    totalPage: null,
  };

  componentDidMount = () => {
    axios
      .get(
        "api/product/readAll?limit=" +
          this.state.limit +
          "&skip=" +
          this.state.skip,
        {
          headers: {
            Authorization: "Bearer " + this.props.token,
          },
        }
      )
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

  getProducts = (number) => {
    this.setState({
      loading: true,
      currentPage: number,
    });
    axios
      .get(
        "api/product/readAll?limit=" +
          this.state.limit +
          "&skip=" +
          this.state.skip +
          (number - 1) * this.state.limit,
        {
          headers: {
            Authorization: "Bearer " + this.props.token,
          },
        }
      )
      .then((response) => {
        this.setState({
          products: response.data.products,
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

  render() {
    let products;
    if (Object.entries(this.state.products).length !== 0) {
      let firstClassName = ["page-item"];
      if (this.state.currentPage === 1) {
        firstClassName.push("disabled");
      }
      let lastClassName = ["page-item"];
      if (this.state.currentPage === this.state.totalPage) {
        lastClassName.push("disabled");
      }
      products = (
        <React.Fragment>
          <Products products={this.state.products} />

          <nav
            aria-label="Page navigation example"
            className={styleClasses.Pagination}>
            <ul className="pagination justify-content-center">
              <li className={firstClassName.join(" ")}>
                <button
                  className="page-link btn btn-link"
                  type="button"
                  onClick={() => {
                    this.getProducts(this.state.currentPage - 1);
                  }}>
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              <li className={firstClassName.join(" ")}>
                <button
                  className="page-link btn btn-link"
                  type="button"
                  onClick={() => {
                    this.getProducts(this.state.currentPage - 1);
                  }}>
                  <span aria-hidden="true">{this.state.currentPage - 1}</span>
                </button>
              </li>
              <li className="page-item active">
                <button
                  className="page-link btn btn-link"
                  type="button"
                  onClick={() => {
                    this.getProducts(this.state.currentPage);
                  }}>
                  <span aria-hidden="true">{this.state.currentPage}</span>
                </button>
              </li>
              <li className={lastClassName.join(" ")}>
                <button
                  className="page-link btn btn-link"
                  type="button"
                  onClick={() => {
                    this.getProducts(this.state.currentPage + 1);
                  }}>
                  <span aria-hidden="true">{this.state.currentPage + 1}</span>
                </button>
              </li>
              <li className={lastClassName.join(" ")}>
                {/* <a
                  className="page-link"
                  onClick={() => {
                    this.getProducts(this.state.currentPage + 1);
                  }}
                  aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a> */}
                <button
                  className="page-link btn btn-link"
                  type="button"
                  onClick={() => {
                    this.getProducts(this.state.currentPage + 1);
                  }}>
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        </React.Fragment>
      );
    }
    if (this.state.products.length === 0) {
      products = (
        <div className={styleClasses.No_Product}>
          <p>Sorry, no product found.</p>
          <p>Please try again.</p>
        </div>
      );
    }
    if (this.state.loading) {
      products = <Spinner />;
    }
    return (
      <div>
        <div className={styleClasses.Carousel}>
          <Carousel images={carouselImages} />
        </div>
        {products}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(Home);
