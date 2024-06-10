import { useNavigate } from "react-router-dom";
import { InputField } from "../components/InputField"
import { useState } from "react";
import fetchData, { Method } from "../helpers/fetchData";
import Loading from "./Loading";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

export interface fetchResponse {
  message: string;
  success?: boolean;
  path?: string;
}

export const Login = () => {
  useAuth(true);

  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const response: fetchResponse = await fetchData({
        method: Method.POST,
        url: "/auth/login",
        body: {
          email: email,
          password: password
        },
      });

      if (response.success) toast.success(response.message);
      else if(response.success === false) toast.error(response.message);
      else toast.error("Something went wrong! Please try again later.")

      if(response.success) localStorage.setItem("email", email);

      if (response.path) navigate(response.path);
      setLoading(false);
    } catch (error) {
      console.log(error)
      toast.error("Internal server error! Please try again later.")

      setLoading(false)
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
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField id={"email"} value={email} onChange={setEmail} type={"email"} label={"Email"} />
            <InputField id={"password"} value={password} onChange={setPassword} type={"password"} label={"Password"} />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </button>
            </div>
          </form>

          <p className="mt-5 mb-4 text-center text-sm text-gray-500 cursor-pointer">
            <a onClick={() => { navigate("/forgot") }} className="text-sm mb-2 font-semibold text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </p>

          <p className="text-center text-sm text-gray-500">
            Do not have an account?{' '}
            <a onClick={() => { navigate("/signup") }} className="cursor-pointer font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Click here
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
