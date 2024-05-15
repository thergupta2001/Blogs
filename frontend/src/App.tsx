import { Route, Routes } from "react-router-dom"
import { Signup } from "./pages/Signup.tsx"
import { Login } from "./pages/Login"
import { Toaster } from "react-hot-toast"
import Loading from "./pages/Loading.tsx"
import { Verify } from "./pages/Verify.tsx"
import { Home } from "./pages/Home.tsx"

function App() {

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
