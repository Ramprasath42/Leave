import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddLeave from "./pages/AddLeave";
import ViewLeaves from "./pages/ViewLeaves";
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddLeave />} />
        <Route path="/leaves" element={<ViewLeaves />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;