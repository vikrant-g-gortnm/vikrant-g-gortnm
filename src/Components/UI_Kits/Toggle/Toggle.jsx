import React, { useState } from 'react';
import './style.css';

const Toggle = (props) => {

  return (

    <div>
      <div>
        <i className = {
          !props.checked
            ?
              `fa fa-signal offGraphColor`
            :
              `fa fa-signal onGraphColor`
          }
        />
        <label className = "switch">
            <input type = "checkbox"
                defaultChecked = {props.checked}
                onClick = {props.handleChecked}
            />
            <span className = "slider round"></span>
        </label>
      </div>
    </div>

  )
}

export default Toggle;