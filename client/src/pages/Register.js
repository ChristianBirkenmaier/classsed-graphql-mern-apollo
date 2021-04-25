import { gql, useMutation } from "@apollo/client";
import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";

import { useForm } from "../util/hooks";

export default function Register(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData } }) {
            context.login(userData);
            props.history.push("/");
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values,
    });

    function registerUser() {
        addUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
                <h1>Register</h1>
                <Form.Input
                    type="text"
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}></Form.Input>
                <Form.Input
                    type="email"
                    label="Email"
                    placeholder="Email.."
                    name="email"
                    value={values.email}
                    error={errors.email ? true : false}
                    onChange={onChange}></Form.Input>
                <Form.Input
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    type="password"
                    error={errors.password ? true : false}
                    value={values.password}
                    onChange={onChange}></Form.Input>
                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password.."
                    type="password"
                    error={errors.confirmPassword ? true : false}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={onChange}></Form.Input>
                <Button type="submit" primary>
                    Register
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((value) => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id
            email
            username
            createdAt
            token
        }
    }
`;
