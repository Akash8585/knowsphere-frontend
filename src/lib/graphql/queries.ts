import { gql } from '@apollo/client';

export const GET_ALL_THREADS = gql`
  query allThreads {
    allThreads {
      id
      title
      clerk_user_id
      created_at
      last_message_at
    }
  }
`;

export const GET_URL_METADATA = gql`
  query GetUrlMetadata($url: String!) {
    urlMetadata(url: $url) {
      title
      image
      domain
    }
  }
`;

export const CREATE_THREAD = gql`
  mutation CreateThread($firstMessage: String!) {
    createThread(firstMessage: $firstMessage) {
      id
      title
      clerk_user_id
      created_at
      last_message_at
    }
  }
`;

export const GET_THREAD_MESSAGES = gql`
  query threadMessages($threadId: String!) {
    threadMessages(threadId: $threadId) {
      id
      thread_id
      role
      content
      sources
      created_at
    }
  }
`;

export const GET_REPLY = gql`
  query GetReply($threadId: String!, $userMessage: String!) {
    reply(threadId: $threadId, userMessage: $userMessage) {
      id
      thread_id
      role
      content
      sources
      created_at
    }
  }
`;

export const DELETE_THREAD = gql`
  mutation DeleteThread($threadId: String!) {
    deleteThread(threadId: $threadId)
  }
`; 