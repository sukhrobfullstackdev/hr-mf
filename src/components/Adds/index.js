import {useEffect, useState} from "react";
import {Card} from "antd";

function Adds({isLink = false,type = 'modal'}){
    const [active,setActive] = useState(0);
    const [adds,setAdds] = useState([
        {
            image: 'uzasbo_dm.jpg',
            title: `UzASBO DM ni mobil qurilmada o'rnatish uchun maxsus havola`,
            link: 'https://apps.apple.com/uz/app/uzasbo/id1627229003'
        },{
            image: 'uzasbo_telegram_bot.jpg',
            title: `UzASBO DM da ishlash uchun maxsus yuriqnomalarga ega bot`,
            link: 'https://t.me/uzasbo_qollanma_bot'
        },{
            image: 'uzasbo_dm_google_play.jpg',
            title: `UzASBO DM ni mobil qurilmada o'rnatish uchun maxsus havola`,
            link: 'https://play.google.com/store/apps/details?id=uz.moliya.uz_asbo'
        }
    ]);
    useEffect(()=>{
        const a = Math.floor(Math.random() * ((adds.length - 1) - 0 + 1)) + 0;
        setActive(a);
    },[])
    return(
        <Card className="mt-3">
            <div className={`app-adds`}>
                <img className="img-fluid" src={`/images/adds/${adds[active].image}`} alt={`${adds[active].title}`}/>
                <p className="m-0 py-2" style={{fontSize: type === 'news' ? '24px' : '16px'}}>
                    <strong>
                        {adds[active].title}
                    </strong>
                </p>
                {
                    adds[active].link ?
                        <p className={`${type === 'news' ? 'text-right' : ''}`}>
                            <a target={"_blank"} href={adds[active].link}>
                                Ko'rish
                            </a>
                        </p>:""
                }
            </div>
        </Card>
    )
}
export default Adds;