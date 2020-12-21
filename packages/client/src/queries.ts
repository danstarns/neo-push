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

export const BLOG = gql`
    query($id: ID) {
        Blogs(where: { id: $id }) {
            id
            name
            creator {
                id
                email
            }
        }
    }
`;

export const CREATE_POST = gql`
    mutation createPost(
        $title: String!
        $content: String!
        $user: ID
        $blog: ID
    ) {
        createPosts(
            input: [
                {
                    title: $title
                    content: $content
                    blog: { connect: { where: { id: $blog } } }
                    author: { connect: { where: { id: $user } } }
                }
            ]
        ) {
            id
        }
    }
`;

export const POST = gql`
    query post($id: ID) {
        Posts(where: { id: $id }) {
            id
            title
            content
            author {
                email
            }
        }
    }
`;

export const BLOG_POSTS = gql`
    query blogPosts($blog: ID) {
        blogPosts: Posts(where: { blog: { id: $blog } }) {
            id
            title
            author {
                email
            }
        }
    }
`;

export const COMMENT_ON_POST = gql`
    mutation commentOnPost($post: ID, $content: String!, $user: ID) {
        commentOnPost: updatePosts(
            where: { id: $post }
            create: {
                comments: [
                    {
                        content: $content
                        author: { connect: { where: { id: $user } } }
                    }
                ]
            }
        ) {
            id
            content
            author {
                id
                email
            }
        }
    }
`;

export const POST_COMMENTS = gql`
    query postComments($post: ID, $skip: Int, $limit: Int) {
        postComments: Comments(
            where: { post: { id: $post } }
            options: { skip: $skip, limit: $limit, sort: id_ASC }
        ) {
            id
            author {
                id
                email
            }
            content
        }
    }
`;
