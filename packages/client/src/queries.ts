import gql from "graphql-tag";

export const SIGNIN = gql`
     mutation signIn($email: String! $password: String!){
        signIn(email: $email, password: $password)
    }
`;

export const SIGNUP = gql`
    mutation signUp($email: String! $password: String!){
        signUp(email: $email, password: $password)
    }
`;

export const USER = gql`
    query user($id: ID) {
        Users(where: {id: $id}){
            email
        }
    }
`