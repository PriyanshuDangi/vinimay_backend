import React from "react";
import styleClasses from "./Inbox.module.css";
import People from "./People/People";

export default function Inbox(props) {
  const people = props.peoples.map((people, index) => {
    // const date = new Date(people.time);
    // console.log(date.getDate());
    // console.log(date.getMonth() + 1);
    // console.log(date.getFullYear());
    // console.log();
    return (
      <People
        people={people}
        changeChannel={props.changeChannel}
        key={index}
        room={props.room}
      />
    );
  });
  return (
    <React.Fragment>
      {/* <div className={styleClasses.Inbox_Box}> */}
      <div className={styleClasses.Inbox_Heading}>
        <div className={styleClasses.Recent_Heading}>
          <h4>Recent</h4>
        </div>
      </div>
      <div className={styleClasses.Inbox_People}>{people}</div>
      {/* </div> */}
    </React.Fragment>
  );
}
