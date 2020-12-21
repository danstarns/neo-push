import gql from "graphql-tag";

export const SIGNIN = gql`
    mutation signIn($email: String!, $password: String!) {
        signIn(email: $email, password: $password)
    }
`;

export const SIGNUP = gql`
    mutation signUp($email: String!, $password: String!) {
        signUp(email: $email, password: $password)
    }
`;

export const USER = gql`
    query user($id: ID) {
        Users(where: { id: $id }) {
            email
        }
    }
`;

export const CREATE_BLOG = gql`
    mutation($name: String!, $sub: ID) {
        createBlogs(
            input: [
                { name: $name, creator: { connect: { where: { id: $sub } } } }
            ]
        ) {
            id
            name
        }
    }
`;

export const MY_BLOGS = gql`
    query myBlogs($id: ID, $skip: Int, $limit: Int) {
        myBlogs: Blogs(
            where: { OR: [{ creator: { id: $id } }, { authors: { id: $id } }] }
            options: { limit: $limit, skip: $skip, sort: id_ASC }
        ) {
            id
            name
            creator {
                id
                email
            }
        }
    }
`;

export const RECENTLY_ADDED_BLOGS = gql`
    query recentlyAddedBlogs($skip: Int, $limit: Int) {
        recentlyAddedBlogs: Blogs(
            options: { limit: $limit, skip: $skip, sort: id_ASC }
        ) {
            id
            name
            creator {
                id
                email
            }
        }
    }
`;
