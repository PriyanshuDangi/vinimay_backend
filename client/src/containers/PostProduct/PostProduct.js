import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";
import styleClasses from "./PostProduct.module.css";
import Input from "../../components/UI/Input/Input";
import axios from "axios";

class PostProduct extends Component {
  state = {
    controls: {
      category: {
        elementType: "select",
        elementConfig: {
          required: true,
          options: [
            { value: "books", displayValue: "Books" },
            { value: "cycle", displayValue: "Cycle" },
          ],
        },
        value: "",
        label: "Category",
        helper: "Choose the correct category properly",
      },
      title: {
        elementType: "input",
        elementConfig: {
          type: "text",
          required: true,
          autoFocus: true,
        },
        value: "",
        label: "Title",
        helper: "Mention the key features of your book (e.g. title, author)",
      },
      description: {
        elementType: "textarea",
        elementConfig: {
          required: true,
          rows: 4,
        },
        value: "",
        label: "Description",
        helper: "Include condition, features",
      },
      price: {
        elementType: "input",
        elementConfig: {
          type: "number",
          required: true,
          min: 0,
          step: 1,
        },
        prepend: "₹",
        value: "",
        label: "Price",
        helper: "Price for the item in Indian Ruppees.",
      },
      image1: {
        elementType: "input",
        elementConfig: {
          type: "file",
          required: this.props.update ? false : true,
          accept: "image/png, image/jpg, image/jpeg",
        },
        value: "",
        label: "Image1",
        helper: "Atleast one image is required",
      },
      image2: {
        elementType: "input",
        elementConfig: {
          type: "file",
          accept: "image/png, image/jpg, image/jpeg",
        },
        value: "",
        label: "Image2",
      },
      image3: {
        elementType: "input",
        elementConfig: {
          type: "file",
          accept: "image/png, image/jpg, image/jpeg",
        },
        value: "",
        label: "Image3",
      },
    },
    error: null,
    loading: false,
  };

  componentDidMount = () => {
    if (this.props.update) {
      let controls = {
        ...this.state.controls,
      };
      // console.log(this.props.product);
      for (const [key, value] of Object.entries(controls)) {
        controls[key].value = this.props.product[key];
      }
      this.setState({
        controls,
      });
    }
  };

  inputChangeHandler = (event) => {
    const updatedControls = {
      ...this.state.controls,
      [event.target.name]: {
        ...this.state.controls[event.target.name],
        value: event.target.value,
        file: event.target.type === "file" ? event.target.files[0] : null,
      },
    };
    this.setState({
      controls: updatedControls,
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    let data = new FormData();
    data.append("image1", this.state.controls.image1.file);
    data.append("image2", this.state.controls.image2.file);
    data.append("image3", this.state.controls.image3.file);
    data.append("title", this.state.controls.title.value);
    data.append("description", this.state.controls.description.value);
    data.append("price", this.state.controls.price.value);
    data.append("category", "books");
    this.setState({
      loading: true,
      error: null,
    });
    let url = "/api/product/create";
    if (this.props.update) {
      url = "/api/product/update/" + this.props.product._id;
    }
    axios
      .post(url, data, {
        headers: {
          accept: "application/json",
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          Authorization: "Bearer " + this.props.token,
        },
      })
      .then((response) => {
        // console.log("success");
        // console.log(response.data);
        this.setState({
          loading: false,
          error: null,
        });
        if (!this.props.update) {
          this.props.history.push("/product/" + response.data.product._id);
        }
        if (this.props.update) {
          this.props.updateComplete();
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
          error: error.response.data.error,
        });
      });
  };

  removeError = () => {
    this.setState({
      error: null,
    });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }
    let formInput = formElementsArray.map((formElement) => (
      <Input
        key={formElement.id}
        name={formElement.id}
        label={formElement.config.label}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        helper={formElement.config.helper}
        changed={this.inputChangeHandler}
        prepend={formElement.config.prepend}
      />
    ));
    let error;
    if (this.state.error) {
      error = (
        <div className="alert alert-warning text-center" role="alert">
          {this.state.error}
          <button
            type="button"
            className={styleClasses.CloseError}
            onClick={this.removeError}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }
    let image1 = <p>Image1</p>;
    let image2 = <p>Image2</p>;
    let image3 = <p>Image3</p>;
    if (this.state.controls.image1.file) {
      image1 = (
        <img
          src={URL.createObjectURL(this.state.controls.image1.file)}
          alt=""
        />
      );
    } else if (this.props.product && this.props.product.image) {
      let src = "data:image/jpg;base64," + this.props.product.image;
      image1 = <img src={src} alt="" />;
    }
    if (this.state.controls.image2.file) {
      image2 = (
        <img
          src={URL.createObjectURL(this.state.controls.image2.file)}
          alt=""></img>
      );
    } else if (this.props.product && this.props.product.image2) {
      let src = "data:image/jpg;base64," + this.props.product.image2;
      image2 = <img src={src} alt="" />;
    }
    if (this.state.controls.image3.file) {
      image3 = (
        <img
          src={URL.createObjectURL(this.state.controls.image3.file)}
          alt=""></img>
      );
    } else if (this.props.product && this.props.product.image3) {
      let src = "data:image/jpg;base64," + this.props.product.image3;
      image3 = <img src={src} alt="" />;
    }
    let preview = (
      <div className={styleClasses.Preview}>
        <div>{image1}</div>
        <div>{image2}</div>
        <div>{image3}</div>
      </div>
    );
    let formContent = (
      <React.Fragment>
        {error}
        <div className="text-center mb-4">
          <h1 className="h3 mb-3 ">Post Your Ad</h1>
        </div>
        {formInput}
        {preview}
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Continue
        </button>
        {this.props.update ? (
          <button
            className="btn btn-sm btn-danger btn-block"
            type="submit"
            onClick={this.props.goBack}>
            Go Back
          </button>
        ) : null}
      </React.Fragment>
    );

    if (this.state.loading) {
      formContent = <Spinner />;
    }
    return (
      <div className={styleClasses.Login}>
        <div className="text-center mb-4"></div>
        <form onSubmit={this.submitHandler}>{formContent}</form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(PostProduct);
