import { Container } from "react-bootstrap";

export default function ErrorPage({ message }) {
  return (
    <Container className="text-center mt-5">
      <h1>Profile Not Found</h1>
      <p>{message}</p>
      <p>Please check the URL or go back to the homepage.</p>
    </Container>
  );
}
