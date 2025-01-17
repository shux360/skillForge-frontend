import React from "react";
import Toast from "./Toast";

const MyComponent = () => {
  return (
    <div>
      <Toast variant="success" message="Action completed successfully!" />
      <Toast variant="destructive" message="An error occurred. Please try again." />
      <Toast variant="warning" message="Please check your input." />
      <Toast variant="info" message="New update available." />
    </div>
  );
};

export default MyComponent;