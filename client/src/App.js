import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "font-awesome/css/font-awesome.min.css";
import Layout from "./hoc/Layout/Layout";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Products from "./components/Products/Products";
import Home from "./containers/Home/Home";
import Login from "./containers/Auth/Login/Login";
import Signup from "./containers/Auth/Signup/Signup";
import Otp from "./containers/Auth/Otp/Otp";
import { connect } from "react-redux";
import * as actionCreators from "./store/actions/index";
import Logout from "./containers/Auth/Logout/Logout";
import PostProduct from "./containers/PostProduct/PostProduct";
import Product from "./containers/Product/Product";
import MyProducts from "./containers/MyProducts/MyProducts";
import Chat from "./containers/Chat/Chat";
import ContactUs from "./components/ContactUs/ContactUs";

class App extends Component {
  componentDidMount = () => {
    this.props.onAuthCheckState();
  };
  render() {
    let routes = (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/" component={Login} />
        {/* <Route path="/otp" component={Otp} /> */}
      </Switch>
    );
    if (this.props.isAuth) {
      routes = (
        <Layout>
          <Switch>
            <Route path="/logout" component={Logout} />
            <Route path="/post" component={PostProduct} />
            <Route path="/product/:id" component={Product} />
            {/* <Route path="/notification" component={Products} /> */}
            <Route path="/myproducts" component={MyProducts} />
            <Route path="/chat" component={Chat} />
            <Route path="/contactus" component={ContactUs} />
            <Route exact path="/" component={Home} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      );
    }

    return (
      <BrowserRouter>
        {/* <Layout>{routes}</Layout> */}
        {routes}
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuthCheckState: () => dispatch(actionCreators.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
