import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container } from "semantic-ui-react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";

import "semantic-ui-css/semantic.min.css";

import "./App.css";

function App() {
    return (
        <>
            <Router>
                <MenuBar />
                <Container>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                </Container>
            </Router>
        </>
    );
}

export default App;
