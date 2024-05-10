import { Route, Routes } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Login } from "./pages/Login"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
