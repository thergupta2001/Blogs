import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/InputField";
import toast from "react-hot-toast";
import fetchData, { Method } from "../helpers/fetchData";
import { fetchResponse } from "./Login";
import Loading from "./Loading";

export const ChangePass = () => {
  const navigate = useNavigate();

  const email: string | null = localStorage.getItem("email");
  const [password, setPassword] = useState<string>("");
  const [checkPass, setCheckPass] = useState<string>("");

  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.removeItem('email');
      alert("Your OTP has expired!")
    }, 5 * 60 * 1000);

    // Cleanup function to clear the timeout if the component unmounts before the timeout
    return () => clearTimeout(timeout);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if(password !== checkPass) {
        alert("Passwords do not match");
        return;
      }

      setLoading(true);

      const response: fetchResponse = await fetchData({
        method: Method.PUT,
        url: import.meta.env.VITE_LINK + "/user/change",
        body: {
          email: email,
          otp: otp,
          password: password
        },
      })

      if (response.success === true) {
        toast.success(response.message);
        localStorage.removeItem("email");
      }
      else if (response.success === false) toast.error(response.message);
      else toast.error("Something went wrong! Please try again later.");

      if (response.path) navigate(response.path);

      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error("Internal server error! Please try again later.");

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
            Change the password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField id={"password"} value={password} onChange={setPassword} type={"password"} label={"Enter password :"} />
            <InputField id={"checkPass"} value={checkPass} onChange={setCheckPass} type={"password"} label={"Re - enter password :"} />
            <InputField id={"otp"} value={otp} onChange={setOtp} type={"text"} label={"Enter OTP :"} />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Change password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
