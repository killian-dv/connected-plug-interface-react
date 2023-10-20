import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Switch from "@mui/material/Switch";
import "./App.css";

function App() {
  const [isOn, setIsOn] = useState(false);
  const apiKey =
    "MWRmYzM2dWlkE62C6C4C76F817CE0A3D2902F5B5D4C115E49B28CF8539114D9246505DE5D368D560D06020A92480";
  const id = "80646F827174";

  const toggleSwitch = async () => {
    const newState = !isOn;
    setIsOn(newState);

    try {
      const response = await axios.post(
        "https://shelly-86-eu.shelly.cloud/device/relay/control",
        {
          channel: 0,
          turn: newState ? "on" : "off",
          id: id,
          auth_key: apiKey,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setIsOn(!newState);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await axios.get(
        `https://shelly-86-eu.shelly.cloud/device/status?id=${id}&auth_key=${apiKey}`
      );
      const status = response.data.data.device_status.relays[0].ison;
      console.log(status);
      setIsOn(status);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const statusInterval = setInterval(fetchStatus, 3000);
    return () => clearInterval(statusInterval);
  }, []);

  return (
    <div>
      <div className="title">
        <h1>Controle Plug S</h1>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth={0}
          viewBox="0 0 14 16"
          height="4rem"
          width="4rem"
        >
          <path
            fillRule="evenodd"
            d="M14 6V5h-4V3H8v1H6c-1.03 0-1.77.81-2 2L3 7c-1.66 0-3 1.34-3 3v2h1v-2c0-1.11.89-2 2-2l1 1c.25 1.16.98 2 2 2h2v1h2v-2h4V9h-4V6h4z"
          />
        </svg>
      </div>
      <p>La prise est {isOn ? "allumée" : "éteinte"}</p>
      <Switch onChange={toggleSwitch} checked={isOn} />
    </div>
  );
}

export default App;
