import React from "react";
import "./App.css";
import Home from "./Home";
import Draw from "./Draw";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            caseSensitive={false}
            element={<Home />}
          ></Route>
          <Route path="/draw" caseSensitive={false} element={<Draw />}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
