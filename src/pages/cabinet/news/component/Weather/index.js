import {useEffect, useRef, useState} from "react";
import useGetWeather from "../../../../../hooks/useGetWeather";
import {Col, Row, Skeleton, Tooltip} from "antd";
import NoData from "../../../../../components/NoData";

function Weather() {
    const [data, get, loader] = useGetWeather();
    const [activeItem, setActiveItem] = useState(1);
    const [weather, setWeather] = useState({});
    const [humidity, setHumidity] = useState({});
    const [humidityIndex, setHumidityIndex] = useState({
        0: `A'lo`,
        50: `O'rtacha`,
        100: `Nosog'lom`,
        150: `Og'ir`,
        200: `O'ta og'ir`,
        301: `O'ta nosog'lom, havfli`
    })
    const timeOut = useRef();
    const [day, setDay] = useState([
        'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'
    ])
    const setActive = ()=>{
        const a = activeItem >= 4 ? 1 : activeItem + 1
        setActiveItem(a);
    }
    useEffect(() => {
        get()
    }, []);
    useEffect(() => {
        if('weather' in data){
            setWeather(data.weather);
        }
        if('humidity' in data){
            setHumidity(data.humidity?.data);
        }
    }, [data]);
    useEffect(()=>{
        timeOut.current = setTimeout(()=>{
            setActive()
        },4000);
        return ()=>{
            return timeOut.current ? clearTimeout(timeOut.current) : null
        }
    },[activeItem]);
    useEffect(()=>{

    },[])
    return loader ?
        <Skeleton active/> :
        Object.keys(data).length ?
        <Row align="middle">
            {
                'weather' in weather && weather.weather.length ?
                    <>
                        <Col span={12}>
                            <p className="text-muted mb-0">
                                {
                                    weather?.name
                                }
                            </p>
                            <h1 className="mb-0">
                                <strong>
                                    {new Date(Date.now()).getHours()}
                                    :
                                    {
                                        new Date(Date.now()).getMinutes() > 9 ? new Date(Date.now()).getMinutes() :
                                            `0${new Date(Date.now()).getMinutes()}`
                                    }
                                </strong>
                            </h1>
                            <p className="m-0 text-muted">
                           <span className="pr-1">
                               {
                                   new Date(Date.now()).toLocaleDateString()
                               }
                           </span>|
                                <span className="pl-1">
                               {
                                   day[new Date(Date.now()).getDay() - 1]
                               }
                           </span>
                            </p>
                        </Col>
                        <Col span={12} className="text-right">
                            <Row align="middle">
                                <Col span={8} className="text-center">
                                    {
                                        weather?.weather[0] ?
                                            <img className="weather-icon" src={`/images/weather/${weather.weather[0].icon}.svg`} alt="Icon"/>:
                                            <img className="weather-icon" src={`/images/weather/01d.svg`} alt="Icon"/>
                                    }
                                </Col>
                                <Col span={16}>
                                    <h2 className="m-0">
                                        <strong>
                                            {
                                                Math.round(weather?.main?.temp)
                                            }
                                            <span className="degree pl-1">
                                  &#9900;
                              </span>C
                                        </strong>
                                    </h2>
                                    <small>
                                        <div className={`text-muted weather-effect`}>
                                            {
                                                activeItem === 1 ?<div className="span-1">Bosim: {weather?.main?.pressure} gPa,</div>:''
                                            }
                                            {
                                                activeItem === 2 ? <div className="span-2">Namlik: {weather?.main?.humidity}%</div> : ""
                                            }
                                            {
                                                activeItem === 3 ? <div className="span-3">Shamol: {weather?.wind?.speed}m/s</div> : ''
                                            }
                                            {
                                                activeItem === 4 ? <div className="span-3">Bulut: {weather?.clouds?.all}%</div> : ''
                                            }
                                        </div>
                                    </small>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <p className="m-0">
                                        <small className="text-muted">
                                            Havoning tozalik indexi:
                                            <span className={`pl-1 
                                humidity humidity-${
                                                humidity.aqi < 50 ? 0 :
                                                    humidity.aqi > 50 ? 50 :
                                                        humidity.aqi > 100 ? 100 :
                                                            humidity.aqi > 150 ? 150 :
                                                                humidity.aqi > 200 ? 200 :
                                                                    humidity.aqi > 300 ? 300 : 301
                                            }
                                `}>
                                    <Tooltip placement="bottom" title={
                                        humidityIndex[`${
                                            humidity.aqi < 50 ? 0 :
                                                humidity.aqi > 50 ? 50 :
                                                    humidity.aqi > 100 ? 100 :
                                                        humidity.aqi > 150 ? 150 :
                                                            humidity.aqi > 200 ? 200 :
                                                                humidity.aqi > 300 ? 300 : 301
                                        }`]
                                    }>
                                        {
                                            humidity.aqi
                                        }
                                    </Tooltip>
                                </span>
                                        </small>
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </>:
                    <Col span={24}>
                        <NoData size="sm"/>
                    </Col>

            }
        </Row> : <NoData message="Ma'lumot mavjud emas!"/>
}

export default Weather;