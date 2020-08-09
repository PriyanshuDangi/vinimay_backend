import React from "react";
import styleClasses from "./Input.module.css";

function Input(props) {
  let input;
  switch (props.elementType) {
    case "input":
      if (props.elementConfig.type === "file") {
        input = (
          <input
            type="file"
            {...props.elementConfig}
            id={props.name}
            name={props.name}
            onChange={props.changed}
          />
        );
        break;
      }
      input = (
        <input
          className="form-control"
          {...props.elementConfig}
          id={props.name}
          name={props.name}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case "textarea":
      input = (
        <textarea
          className="form-control"
          {...props.elementConfig}
          id={props.name}
          name={props.name}
          value={props.value}
          onChange={props.changed}></textarea>
      );
      break;
    case "select":
      input = (
        <select
          className="custom-select form-control"
          required={props.elementConfig.required}
          id={props.name}
          name={props.name}
          value={props.value}
          onChange={props.changed}>
          <option value="">Choose...</option>
          {props.elementConfig.options.map((opt, index) => (
            <option key={index} value={opt.value}>
              {opt.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    default:
      input = (
        <input
          className="form-control"
          {...props.elementConfig}
          id={props.name}
          name={props.name}
          value={props.value}
          onChange={props.changed}
        />
      );
  }
  return (
    <div className="form-group">
      <div className={styleClasses.Input}>
        <label htmlFor={props.name}>{props.label}</label>
        <div className="input-group">
          {props.prepend ? (
            <div className="input-group-prepend">
              <span className="input-group-text">{props.prepend}</span>
            </div>
          ) : null}
          {input}
        </div>
      </div>
      {props.helper ? (
        <small id="emailHelp" className="form-text text-muted">
          <i className="fa fa-info" aria-hidden="true"></i> {props.helper}
        </small>
      ) : null}
    </div>
  );
}

export default Input;
