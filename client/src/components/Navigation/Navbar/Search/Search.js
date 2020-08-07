import React from "react";

export default function Search(props) {
  return (
    <div>
      <form className="form-inline my-2 my-lg-0" onSubmit={props.onSearch}>
        <div className="input-group flex-nowrap">
          <input
            type="text"
            className="form-control"
            placeholder="Search Product"
            aria-label="Username"
            aria-describedby="addon-wrapping"
            onChange={props.onSearchInputChange}
            value={props.searchInput}
          />
          <div className="input-group-prepend">
            <button
              type="submit"
              className="input-group-text"
              id="addon-wrapping">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
