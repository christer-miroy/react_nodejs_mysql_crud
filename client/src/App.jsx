import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import AddListing from "./pages/AddListing"
import ViewListing from "./pages/ViewListing"
import UpdateListing from "./pages/UpdateListing"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddListing />} />
        <Route path="/view/:id" element={<ViewListing />} />
        <Route path="/update/:id" element={<UpdateListing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
