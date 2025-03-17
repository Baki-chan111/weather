import React, { useEffect, useState } from "react";
import "./Weather.scss";
import axios from "axios";
import { useSearchParams } from "react-router";

const WeatherCard = ({ day, date, temp, minTemp, condition, icon }) => {
  return (
    <div className="weather-card">
      <h3>{day}</h3>
      <p className="date">{date}</p>
      <div className="icon">
        <img src={icon} alt={condition} />
      </div>
      <p className="temp">{temp}°</p>
      <p className="min-temp">{minTemp}°</p>
      <p className="condition">{condition}</p>
    </div>
  );
};

const CurrentWeather = () => {
  const [searchParams, _] = useSearchParams();
  const searchParamsResult = searchParams.get("city");
  const [headerData, setHeaderData] = useState(null);
  const [city, setCity] = useState(searchParamsResult);
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
    setCity(searchParamsResult);
    const interval = setInterval(getHeaderData, 86400000); // Обновление данных каждый день (24 часа = 86400000 миллисекунд)
    return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
  }, [city, searchParamsResult]);

  if (loading) {
    return <h1>Загрузка данных...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!headerData) {
    return <h1>Нет данных для отображения</h1>;
  }

  return (
    <div className="container">
      <div className="weather">
        <div className="weather__main">
          {headerData && headerData.main && (
            <div className="weather-box">
              <h1 className="temperature">
                {headerData.main?.temp ?? "Нет данных"}°C
              </h1>
              <div className="details">
                <p className="city">
                  {headerData.name}, {headerData.sys?.country || "Неизвестно"}
                </p>
                <p className="time">
                  Время:{" "}
                  {new Date(headerData.dt * 1000).toLocaleString("ru-RU")}
                </p>
                <p>{headerData.weather?.[0]?.description || "Нет данных"}</p>
              </div>
            </div>
          )}
          <div className="weather-icon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/869/869869.png"
              alt="sun"
            />
          </div>
        </div>
        <div className="weather-info">
          <div className="info-item">
            <span>Температура:</span> {headerData.main?.temp ?? "Нет данных"}°C
          </div>
          <div className="info-item">
            <span> Погода: </span>
            {headerData.weather?.[0]?.description || "Нет данных"}
          </div>
          <div className="info-item">
            <span>Влажность:</span> {headerData.main?.humidity ?? "Неизвестно"}%
          </div>
          <div className="info-item">
            <span>Ветер:</span> {headerData.wind?.speed ?? "Неизвестно"}
          </div>
        </div>
      </div>
    </div>
  );
};

const getDaysOfWeek = () => {
  const days = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  const today = new Date();
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    daysOfWeek.push({
      day: days[nextDay.getDay()],
      date: nextDay.toLocaleDateString("ru-RU"),
    });
  }
  return daysOfWeek;
};

const WeatherForecast = () => {
  const [selectedTab, setSelectedTab] = useState("week");
  const [weatherData, setWeatherData] = useState([]);

  const tabs = [{ id: "week", label: "Прогноз недели" }];

  const fetchForecastData = async () => {
    const city = "Bishkek";
    const API_KEY = "68a3ddbb2e407595fd082c052a080609";
    const API_URL = "https://api.openweathermap.org/data/2.5/forecast";

    try {
      const response = await axios.get(API_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
          lang: "ru",
        },
      });

      const forecastData = response.data.list
        .filter((item, index, array) => {
          const currentDay = new Date(item.dt * 1000).getDate();
          const nextDay = new Date(array[index + 1]?.dt * 1000)?.getDate();
          return currentDay !== nextDay;
        })
        .map((item) => ({
          day: new Date(item.dt * 1000).toLocaleString("ru-RU", {
            weekday: "long",
          }),
          date: new Date(item.dt * 1000).toLocaleDateString("ru-RU"),
          temp: Math.floor(item.main.temp),
          minTemp: Math.floor(item.main.temp_min),
          condition: item.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
        }));

      setWeatherData(forecastData);
    } catch (error) {
      console.error("Ошибка получения прогноза:", error);
    }
  };

  useEffect(() => {
    fetchForecastData();
  }, []);

  return (
    <div className="weather-container">
      <div className="container">
        <CurrentWeather />
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={selectedTab === tab.id ? "active" : ""}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="weather-list">
          {weatherData.length > 0 ? (
            weatherData.map((data, index) => (
              <WeatherCard key={index} {...data} />
            ))
          ) : (
            <p>Нет данных для отображения прогноза.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
