import { useEffect, useState } from "react";
import axios from "axios";

export default function Test() {
  const [message, setMessage] = useState();

  useEffect(() => {
    const getTestMessage = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/message`
      );
      setMessage(response.data.message);
    };

    getTestMessage();
  }, []);
  return <div>{message}</div>;
}
