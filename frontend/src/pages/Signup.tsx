import { useState } from "react"
import { InputField } from "../components/InputField"
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loadingAtom } from "../store";
import toast from "react-hot-toast";
import Loading from "./Loading.tsx";
import fetchData, { Method } from "../helpers/fetchData";

interface fetchResponse {
    message: string;
    success?: string;
    path?: string;
}

export const Signup = () => {
    const navigate = useNavigate();
    // const name: string | null = useRecoilValue(usernameAtom);
    const [loading, setLoading] = useRecoilState<boolean>(loadingAtom);

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setLoading(true);

            const response: fetchResponse = await fetchData({
                method: Method.POST,
                url: import.meta.env.VITE_LINK + "/auth/signup",
                body: {
                    username: username,
                    email: email,
                    password: password
                }
            });

            // console.log(response);

            // console.log(response.message);

            if(response.message) toast.success(response.message);
            else toast.error("Something went wrong");

            if(response.path) navigate(response.path);

            setLoading(false);
        } catch (error) {
            console.log(error)

            setLoading(false)
        }
    }

    if(loading) return <Loading />

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <InputField id={"username"} value={username} onChange={setUsername} type={"text"} label={"Username"} />
                        <InputField id={"email"} value={email} onChange={setEmail} type={"email"} label={"Email"} />
                        <InputField id={"password"} value={password} onChange={setPassword} type={"password"} label={"Password"} />

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-5 mb-4 text-center text-sm text-gray-500">
                        <a href="#" className="text-sm mb-2 font-semibold text-indigo-600 hover:text-indigo-500">
                            Forgot password?
                        </a>
                    </p>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <a onClick={() => { navigate("/") }} className="cursor-pointer font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Click here
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
