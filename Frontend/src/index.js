import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import ListAd from "./components/ad/ListAd";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import MessageBoard from "./components/questions/MessageBoard";
import AddAd from "./components/ad/AddAd";
import EditAd from "./components/ad/EditAd";
import PrivateAd from "./components/ad/PrivateAd";
import EditProfile from "./components/auth/EditProfile";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";
import PrivateRoute from "./components/auth/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="ad/list" element={<ListAd />} />
          <Route path="ad/questions/:adId" element={<MessageBoard />} />
          <Route path="ad/add" element={
            <PrivateRoute>
              <AddAd />
            </PrivateRoute>} />
          <Route path="ad/edit/:id" element={
            <PrivateRoute>
              <EditAd />
            </PrivateRoute>} />
          <Route path="ad/private" element={
            <PrivateRoute>
              <PrivateAd />
            </PrivateRoute>} />
          <Route path="users/signin" element={<Signin />} />
          <Route path="users/signup" element={<Signup />} />
          <Route path="users/editProfile/:userId" element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);