import * as React from "react";
import './UI.css';

function Plus(props) {
  return <button className="plus" onClick={props.handleClick}><svg  stroke="currentColor" fill="currentColor" strokeWidth={0} t={1551322312294} viewBox="0 0 1024 1024"><defs /><path d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"/><path d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z" /></svg></button>;
}

export default Plus;