import { useState } from "react"
import { InputField } from "../components/InputField"
import toast from "react-hot-toast";
import Loading from "./Loading";
import { fetchResponse } from "./Login";
import fetchData, { Method } from "../helpers/fetchData";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export const ForgotPass = () => {
    useAuth(true);

    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setLoading(true);

            const response: fetchResponse = await fetchData({
                method: Method.POST,
                url: "/user/forgot",
                body: {
                    email: email,
                },
            });

            if (response.success) toast.success(response.message);
            else if (response.success === false) toast.error(response.message);
            else toast.error("Something went wrong! Please try again later.")

            if (response.success) localStorage.setItem("email", email);

            if (response.path) navigate(response.path);

            setLoading(false);
        } catch (error) {
            console.log(error)
            toast.error("Internal server error! Please try again later.")

            setLoading(false);
        }
    }

    if (loading) return <Loading />

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
                        Forgot Password
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <InputField id={"forgot"} value={email} onChange={setEmail} type={"text"} label={"Enter your email :"} />

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Send OTP
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
