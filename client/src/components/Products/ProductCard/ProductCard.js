import React from "react";
import styleClasses from "./ProductCard.module.css";
import { NavLink } from "react-router-dom";

export default function ProductCard(props) {
  const imageSrc = "data:image/jpg;base64," + props.product.image;
  return (
    <div
      className={`col-lg-3 col-md-4 col-sm-6 col-6 ${styleClasses.ProductCard}`}>
      <NavLink to={`/product/${props.product._id}`}>
        <div className={`card ${styleClasses.Card}`}>
          <div className={styleClasses.Image}>
            <img src={imageSrc} className="card-img-top" alt="..." />
          </div>
          <div className={`card-body ${styleClasses.CardBody}`}>
            <h4 className="card-title">₹ {props.product.price}</h4>
            <p className="card-text">{props.product.title}</p>
          </div>
        </div>
      </NavLink>
    </div>
  );
}
