import React from "react";
import Header from "./header/Header";
import MainRoutes from "../routes/MainRoutes";
import WeatherForecast from "../days/Weather";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <MainRoutes />
      </main>
      <WeatherForecast />
    </>
  );
};
export default Layout;
