import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { emailAtom, usernameAtom } from "../store";
import fetchData, { Method } from "../helpers/fetchData";
import { useNavigate } from "react-router-dom";

export default function useAuth(inAuth: boolean = false) {
    const navigate = useNavigate();

    const setUsername = useSetRecoilState(usernameAtom);
    const setEmail = useSetRecoilState(emailAtom);

    useEffect(() => {
        async function auth() {
            try {
                const responses = await fetchData({
                    method: Method.GET,
                    url: "/getUsername",
                    credentials: true
                })

                // console.log(responses);

                setUsername(responses.data.username);
                setEmail(responses.data.email);

                if (inAuth) navigate("/home", { replace: true });
            } catch (error) {
                // console.error(error);

                setUsername(null);
                setEmail(null);

                if(!inAuth) navigate("/", {replace: true});
            }
        }

        auth();
    }, [navigate, setEmail, setUsername, inAuth])
}