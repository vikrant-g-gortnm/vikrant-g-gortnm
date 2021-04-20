import React from "react";

export class ErrorBoundary extends React.Component {
  state = {
    error: null,
  };

  componentDidCatch(error, info) {
    this.setState({ error });
    console.dir("Component Did Catch Error", error, info);
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      return <div className="p1">We are updating </div>;
    }
    return this.props.children;
  }
}
