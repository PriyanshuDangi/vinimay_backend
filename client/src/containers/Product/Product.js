import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Spinner from "../../components/UI/Spinner/Spinner";
import Carousel from "../../components/Carousel/Carousel";
import styleClasses from "./Product.module.css";
import Modal from "../../components/UI/Modal/Modal";
import PostProduct from "../PostProduct/PostProduct";

class Product extends Component {
  state = {
    product: {},
    isOwner: false,
    loading: true,
    error: null,
    showShareModal: false,
    showDeleteModal: false,
    showUpdate: false,
    deleteLoading: false, //loading for deleting the product
    deleted: false,
    chatLoading: false,
  };

  componentDidMount = () => {
    axios
      .get("/api/product/read/" + this.props.match.params.id, {
        headers: {
          Authorization: "Bearer " + this.props.token,
        },
      })
      .then((response) => {
        // console.log(response);
        this.setState({
          product: response.data.product,
          isOwner: response.data.isOwner,
          error: null,
          loading: false,
        });
      })
      .catch((error) => {
        // console.log(error);
        this.setState({
          loading: false,
          error: error.response.data.error,
        });
      });
  };

  toggleUpdate = () => {
    this.setState((prevState) => {
      return {
        showUpdate: !prevState.showUpdate,
        showShareModal: false,
        showDeleteModal: false,
        deleteLoading: false,
      };
    });
  };

  toggleShareModel = () => {
    this.setState((prevState) => {
      return {
        showShareModal: !this.state.showShareModal,
        showDeleteModal: false,
        deleteLoading: false,
      };
    });
  };

  copyToClipboard = () => {
    var copyText = document.getElementById("myInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    var flashText = document.getElementById("flashText");
    flashText.innerText = "Copied To ClipBoard";
    setTimeout(() => {
      flashText.innerText = "";
    }, 500);
  };

  toggleDeleteModel = () => {
    if (!this.state.deleteLoading) {
      this.setState((prevState) => {
        return {
          showDeleteModal: !this.state.showDeleteModal,
          showShareModal: false,
          deleteLoading: false,
        };
      });
    }
    if (this.state.deleted) {
      this.props.history.push("/");
    }
  };

  deleteProduct = () => {
    this.setState({
      deleteLoading: true,
    });
    axios
      .delete("/api/product/delete/" + this.props.match.params.id, {
        headers: {
          Authorization: "Bearer " + this.props.token,
        },
      })
      .then((response) => {
        this.setState({
          deleteLoading: false,
          deleted: true,
        });
      })
      .catch((error) => {
        this.setState({
          deleteLoading: false,
          error: error.response.data.error,
        });
      });
  };

  chatWithSeller = () => {
    this.setState({
      chatLoading: true,
    });
    axios
      .post(
        "/api/chat/channel/create/",
        {
          sellerId: this.state.product.owner,
        },
        {
          headers: {
            Authorization: "Bearer " + this.props.token,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        // this.props.history.push("/chat?cid=" + response.data.channel._id);
        this.props.history.push({
          pathname: "/chat",
          state: { channelId: response.data.channel._id },
        });
      })
      .catch((error) => {
        // console.log(error);
        this.setState({
          chatLoading: false,
          error: error.response.data.error,
        });
      });
  };

  removeAlert = () => {
    this.setState({
      error: null,
    });
  };

  render() {
    let content;
    if (this.state.loading) {
      content = <Spinner />;
    }
    if (this.state.product.title) {
      let sellerDetails = (
        <div className={styleClasses.ProductSeller}>
          <h3>Seller</h3>
          {/* <h3>Seller Details</h3>
          <b>{this.state.product.owner}</b>
          <p>Owner Webmail</p> */}
          {this.state.chatLoading ? (
            <button style={{ textAlign: "center", border: "0", width: "100%" }}>
              <i className="fa fa-spinner fa-spin fa-2x" aria-hidden="true"></i>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={this.chatWithSeller}>
              Chat With Seller
            </button>
          )}
        </div>
      );
      if (this.state.isOwner) {
        sellerDetails = (
          <div className={styleClasses.ProductSeller}>
            <button
              type="button"
              className="btn btn-outline-primary btn-block"
              onClick={this.toggleUpdate}>
              Update Product Details
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-block"
              onClick={this.toggleShareModel}>
              Share Product With Friends
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-block"
              onClick={this.toggleDeleteModel}>
              Product Sold or Delete
            </button>
          </div>
        );
      }
      let src = "data:image/jpg;base64," + this.state.product.image;
      const carouselImage = [{ img: src }];
      if (this.state.product.image2) {
        src = "data:image/jpg;base64," + this.state.product.image2;
        carouselImage.push({ img: src });
      }
      if (this.state.product.image3) {
        src = "data:image/jpg;base64," + this.state.product.image3;
        carouselImage.push({ img: src });
      }
      content = (
        <div className={styleClasses.Container}>
          <div className={styleClasses.Product}>
            <div className={styleClasses.Carousel}>
              <Carousel images={carouselImage} />
            </div>

            <div className={styleClasses.Details}>
              <div className={styleClasses.ProductDetails}>
                <h3>Product Details</h3>
                <b>Price: ₹{this.state.product.price}</b>
                <p>Title: {this.state.product.title}</p>
                <p>Category: {this.state.product.category}</p>
              </div>
              {sellerDetails}
            </div>
          </div>
          <div className={styleClasses.ProductDescription}>
            <div>
              <h3>Description</h3>
              <p>{this.state.product.description}</p>
            </div>
          </div>
        </div>
      );
    }
    let modal;
    if (this.state.showShareModal) {
      modal = (
        <Modal
          show={this.state.showShareModal}
          modalClosed={this.toggleShareModel}>
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Share This Link With Your Friends
            </h5>
            <button
              type="button"
              className="close"
              onClick={this.toggleShareModel}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" style={{ textAlign: "center" }}>
            <input
              type="text"
              value={window.location.href}
              id="myInput"
              readOnly
              style={{ width: "80%" }}
            />
            <button onClick={this.copyToClipboard}>
              <i className="fa fa-clone" aria-hidden="true"></i>
            </button>
            <p id="flashText"></p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={this.toggleShareModel}>
              Close
            </button>
          </div>
        </Modal>
      );
    } else if (this.state.showDeleteModal) {
      modal = (
        <Modal
          show={this.state.showDeleteModal}
          modalClosed={this.toggleDeleteModel}>
          {this.state.deleteLoading ? (
            <Spinner />
          ) : (
            <React.Fragment>
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Delete This Product
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.toggleDeleteModel}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ textAlign: "center" }}>
                {this.state.deleted ? (
                  <b>Product Deleted Successfully</b>
                ) : (
                  <b>Are you sure you want to delete this product?</b>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={this.toggleDeleteModel}>
                  Close
                </button>
                {this.state.deleted ? null : (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.deleteProduct}>
                    Delete
                  </button>
                )}
              </div>
            </React.Fragment>
          )}
        </Modal>
      );
    } else if (this.state.showUpdate) {
      content = (
        <PostProduct
          product={this.state.product}
          update
          updateComplete={this.toggleUpdate}
          goBack={this.toggleUpdate}
        />
      );
    }
    let error;
    if (this.state.error) {
      error = (
        <div className={styleClasses.Alert}>
          <div className="alert alert-warning text-center" role="alert">
            {this.state.error}
            <button type="button" onClick={this.removeAlert}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className={styleClasses.Main}>
        {error}
        {modal}
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(Product);
