import React from 'react'
import { Button, Container, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    state = { hasError: false }

    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true })
        console.error(error, errorInfo);
    }

    handleClick = () => {
        this.props.history.push('/')
        this.setState({ hasError: false })
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <Container fluid>
                    <Row>
                        <h1>Something went wrong.</h1>
                    </Row>
                    <Row className="d-flex align-content-center">
                        <Button onClick={this.handleClick}>Go to Main Page</Button>
                    </Row>
                </Container>
            )
        }

        return this.props.children;
    }
}

export default withRouter(ErrorBoundary)