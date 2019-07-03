import React from 'react';
import Meta from './Meta';
import App from './main/App';

function Start() {
  return (<div>
    <Meta></Meta>
    <App/>
    <div id='modal-root'></div>
  </div>)
}

export default Start
