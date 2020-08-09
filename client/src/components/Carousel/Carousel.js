import React from "react";

// export default function Jumbotron() {
//   return (
//     <div>
//       <img src={olxImage} width="100%" alt="hello world" />
//     </div>
//   );
// }

export default function Carousel(props) {
  const carouselItem = props.images.map((element, index) => {
    const classes = ["carousel-item"];
    if (index === 0) {
      classes.push("active");
    }
    return (
      <div className={classes.join(" ")} key={index}>
        <img src={element.img} className="d-block" alt="..." />
        {/* <div className="carousel-caption d-none d-md-block">
          <h5>First slide label</h5>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </div> */}
      </div>
    );
  });
  const indicators = props.images.map((element, index) => {
    if (index === 0) {
      return (
        <li
          data-target="#carouselExampleCaptions"
          data-slide-to="0"
          className="active"
          key={index}
          style={{ backgroundColor: "#000" }}></li>
      );
    }
    return (
      <li
        data-target="#carouselExampleCaptions"
        data-slide-to={index}
        key={index}
        style={{ backgroundColor: "#000" }}></li>
    );
  });
  return (
    <div
      id="carouselExampleCaptions"
      className="carousel slide"
      data-ride="carousel"
      data-interval="false">
      <ol className="carousel-indicators">{indicators}</ol>
      <div className="carousel-inner">{carouselItem}</div>
      <a
        className="carousel-control-prev"
        href="#carouselExampleCaptions"
        role="button"
        data-slide="prev">
        <span
          className="carousel-control-prev-icon"
          aria-hidden="true"
          style={{ backgroundColor: "#222" }}></span>
        <span className="sr-only">Previous</span>
      </a>
      <a
        className="carousel-control-next"
        href="#carouselExampleCaptions"
        role="button"
        data-slide="next">
        <span
          className="carousel-control-next-icon"
          aria-hidden="true"
          style={{ backgroundColor: "#222" }}></span>
        <span className="sr-only">Next</span>
      </a>
    </div>
  );
}
