import { useRecoilValue } from "recoil";
import { emailAtom, usernameAtom } from "../store";
import useAuth from "../hooks/useAuth";

export const Home = () => {
  useAuth();

  const email = useRecoilValue(emailAtom);
  const username = useRecoilValue(usernameAtom);

  return (
    <div>Home {username} {email}</div>
  )
}
