import React, { useState } from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  FormGroup,
} from "react-bootstrap";
import apis from "../../../services/apis";
import { errorMessage } from "../../../tools/toastify";

export default ({ onAccessToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async () => {
    try {
      let answer = await apis.gaelo.login(email, password);
      onAccessToken(answer.id, answer.access_token);
    } catch (error) {
        console.log(error)
      errorMessage(error?.data?.errorMessage ?? "Failed to reach GaelO");
    }
  };

  return (
    <div>
      <Container fluid>
        <FormGroup>
          <Form.Label>Email</Form.Label>
          <FormControl
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          ></FormControl>
        </FormGroup>
        <FormGroup>
          <Form.Label>Password</Form.Label>
          <FormControl
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          ></FormControl>
        </FormGroup>
        <FormGroup>
          <Button onClick={loginHandler}>Login</Button>
        </FormGroup>
      </Container>
    </div>
  );
};
