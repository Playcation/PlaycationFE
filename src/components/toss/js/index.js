import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CheckoutPage } from '../jsx/Checkout.jsx';
import { SuccessPage } from '../jsx/Success.jsx';
import { FailPage } from '../jsx/Fail.jsx';
import '../style.css';

const router = createBrowserRouter([
  {
    path: "/sandbox",
    element: <CheckoutPage />,
  },
  {
    path: "/sandbox/success",
    element: <SuccessPage />,
  },
  {
    path: "/sandbox/fail",
    element: <FailPage />,
  },
]);

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);