import React, { Component } from "react";
import Products from "../../components/Products/Products";
import styleClasses from "./Search.module.css";
import axios from "axios";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";

const sortOptions = [
  { show: "Date Modified", send: "createdAt" },
  { show: "Price (Low To High)", send: "price-asc" },
  { show: "Price (High To Low)", send: "price-desc" },
];

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
    showDropDown: false,
    sortBy: 0,
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

  sendSearchRequest = (option) => {
    var urlParams = new URLSearchParams(this.props.location.search);
    let link = "api/product/search?string=" + urlParams.get("string");
    if (option) {
      var sortBy = sortOptions[option].send;
      link =
        "api/product/search?string=" +
        urlParams.get("string") +
        "&sortBy=" +
        sortBy;
    }
    axios
      .get(link, {
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
    var urlParams = new URLSearchParams(this.props.location.search);
    if (urlParams.get("string") !== this.state.string) {
      this.setState({
        string: urlParams.get("string"),
        sortBy: 0,
      });
      this.sendSearchRequest();
      console.log("sent");
    }
  };

  toggleDropDown = () => {
    this.setState((prevState) => {
      return {
        showDropDown: !prevState.showDropDown,
      };
    });
  };

  setSortBy = (option) => {
    if (option !== this.state.sortBy) {
      this.setState({
        sortBy: option,
      });
      this.sendSearchRequest(option);
    }
    this.toggleDropDown();
  };

  render() {
    let dropdown;
    if (this.state.showDropDown) {
      dropdown = (
        <ul className={styleClasses.DropDown}>
          {sortOptions.map((option, index) => {
            return (
              <li
                key={index}
                onClick={() => {
                  this.setSortBy(index);
                }}>
                {option.show}
              </li>
            );
          })}
        </ul>
      );
    }

    let products = (
      <React.Fragment>
        <div className={styleClasses.Top}>
          <div className={styleClasses.StringName}>
            Showing results for <b>"{this.state.string}"</b>
          </div>
          <div className={styleClasses.SortBy}>
            <div className={styleClasses.SortByDetails}>
              <div>
                <b>Sort By : </b>
              </div>
              <div>
                {" "}
                <span> {sortOptions[this.state.sortBy].show}</span>
                <button onClick={this.toggleDropDown}>
                  {this.state.showDropDown ? (
                    <i className="fa fa-chevron-up" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-chevron-down" aria-hidden="true"></i>
                  )}
                </button>
              </div>
            </div>

            {dropdown}
          </div>
        </div>
        <div className={styleClasses.TopBorder}></div>
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
