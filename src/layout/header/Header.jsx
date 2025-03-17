import React, { useEffect, useState } from "react";
import axios from "axios";
import img from "./Group.svg";
import { MdOutlineInvertColors } from "react-icons/md";
import scss from "./Header.module.scss";
import { useSearchParams } from "react-router";

const Header = () => {
  const [_, setSearchParams] = useSearchParams();
  const [headerData, setHeaderData] = useState(null);
  const [city, setCity] = useState("Бишкек");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "68a3ddbb2e407595fd082c052a080609";
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";

  const getHeaderData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
          lang: "ru",
        },
      });
      setHeaderData(response.data);
    } catch (err) {
      console.error("Ошибка запроса:", err);
      setError(`Ошибка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHeaderData();
    setSearchParams({ city: city });
  }, [city]);

  return (
    <header id={scss.header}>
      <div className="container">
        <div className={scss.header}>
          <div className={scss.logo}>
            <img src={img} alt="logo" />
            <h1> REACT WEATHER</h1>
          </div>
          <div className={scss.select}>
            <MdOutlineInvertColors className={scss.icon} />
            <select
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="Bishkek">Bishkek</option>
              <option value="Osh">Osh</option>
              <option value="Batken">Batken</option>
              <option value="Jalal-Abad">Jalal-Abad</option>
              <option value="Naryn">Naryn</option>
              <option value="Issyk-Kul">Issyk-Kul</option>
              <option value="Talas">Talas</option>
              <option value="Chuy">Chuy</option>
            </select>
          </div>
        </div>

        {/* <div className={scss.search}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Введите город"
          />
          <button onClick={getHeaderData}>Получить данные</button>
        </div> */}

        {/* {loading && <p>Загрузка...</p>}
        {error && <p className={scss.error}>{error}</p>}

        {headerData && headerData.main && (
          <div className={scss.headerInfo}>
            <h2>
              {headerData.name}, {headerData.sys?.country || "Неизвестно"}
            </h2>
            <p>Температура: {headerData.main?.temp ?? "Нет данных"}°C</p>
            <p>
              Погода: {headerData.weather?.[0]?.description || "Нет данных"}
            </p>
            <p>Влажность: {headerData.main?.humidity ?? "Неизвестно"}%</p>
            <p>Ветер: {headerData.wind?.speed ?? "Неизвестно"} м/с</p>
          </div>
        )} */}
      </div>
    </header>
  );
};

export default Header;
