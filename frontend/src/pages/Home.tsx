import { useEffect } from "react";
import fetchData, { Method } from "../helpers/fetchData";
import { useRecoilState } from "recoil";
import { usernameAtom } from "../store";

export const Home = () => {
  const [username, setUsername] = useRecoilState(usernameAtom);

  useEffect(() => {
    async function fetchUsername() {
      const response = await fetchData({
        method: Method.GET,
        url: import.meta.env.VITE_LINK + "/getUsername",
        credentials: true
      })

      console.log(response);

      setUsername(response.data.username);
    }

    fetchUsername();
  }, [setUsername]);

  return (
    <div>Home {username}</div>
  )
}
