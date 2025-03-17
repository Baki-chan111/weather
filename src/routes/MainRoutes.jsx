import React from "react";
import { Route, Routes } from "react-router-dom";

const MainRoutes = () => {
  const routes = [
    {
      link: "/",
      element: "",
      id: 1,
    },
    {
      link: "",
      element: "",
      id: 2,
    },
    {
      link: "",
      element: "",
      id: 3,
    },
  ];
  return (
    <Routes>
      {routes.map((item) => (
        <Route path={item.link} element={item.element} key={item.id} />
      ))}
    </Routes>
  );
};

export default MainRoutes;
