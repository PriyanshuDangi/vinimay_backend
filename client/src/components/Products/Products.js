import React from "react";
import ProductCard from "./ProductCard/ProductCard";

export default function Products(props) {
  const products = Object.entries(props.products);
  let productCards = products.map((product, index) => {
    return <ProductCard key={index} product={product[1]} />;
  });
  return (
    <div className="container-fluid">
      <div className="row" style={{ justifyContent: "space-around" }}>
        {productCards}
        {/* <ProductCard />
        <ProductCard /> */}
      </div>
    </div>
  );
}
