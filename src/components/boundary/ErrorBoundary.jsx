import { Component } from "react";

import Boundary from "./Boundary";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.error("Caught by Error Boundary:", error);
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <Boundary />;
        }
        return this.props.children;
    }
}
