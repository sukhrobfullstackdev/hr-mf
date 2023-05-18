import {Button, Card, Col, Row, Skeleton} from "antd";
import SideBar from "../component/SideBar";
import BlockLoader from "../../../components/Loader/BlockLoader";
import Rate from "./component/Rate";
import {useEffect, useState} from "react";
import useGetNews from "../../../hooks/useGetNews";
import {connect} from "react-redux";
import NewsBlock from "./component/NewsBlock";
import Weather from "./component/Weather";
import Adds from "../../../components/Adds";

function News({loader = false}){
    const [data,get,newsLoader] = useGetNews();
    const [newsList,setNewsList] = useState([]);
    const [offset,setOffset] = useState(0);
    const [limit,setLimit] = useState(3);
    useEffect(()=>{
        get({
            offset: offset,
            limit: limit
        })
    },[offset]);
    useEffect(()=>{
        if(data.length){
            let ms = newsList;
            const text = process.env.REACT_APP_FILTER_TXT.split(' ');
            for (const textKey of text) {
                data.map((item,i)=>{
                    if( item.title.toLowerCase().indexOf(textKey) > -1 ){
                        data.splice(i,1);
                    }
                })
            }
            ms = ms.concat(data);
            setNewsList(ms);
        }
    },[data]);
    const showMore =()=>{
        const a = offset + limit;
        setOffset(a);
    }
    return (
        <Row gutter={24} className="mt-4">
            <Col xs={24} sm={24} md={24} lg={7}>
                {
                    loader ?
                        <Card className="h-100">
                            <Skeleton active/>
                        </Card>:
                        <SideBar/>
                }
            </Col>
            <Col xs={24} sm={24} md={24} lg={17}>
                <h3 className="text-muted">
                    <strong>Yangiliklar</strong>
                </h3>
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={24} lg={14} xxl={16} className="news-wrapper">
                        {
                            newsLoader && !newsList.length ?
                                <Card className="my-3">
                                    <BlockLoader className="mb-3" type='title'/>
                                    <BlockLoader className="mb-3" type='image'/>
                                    <BlockLoader className="mb-3"/>
                                    <BlockLoader className="mb-3"/>
                                    <BlockLoader className="mb-3"/>
                                </Card> :
                                <NewsBlock news={newsList}/>
                        }
                        {
                            newsLoader && !newsList.length ?
                                "":
                                <div className="text-center">
                                    {
                                        newsLoader ?
                                            <Card className="my-3">
                                                <BlockLoader className="mb-3" type='title'/>
                                                <BlockLoader className="mb-3" type='image'/>
                                                <BlockLoader className="mb-3"/>
                                                <BlockLoader className="mb-3"/>
                                                <BlockLoader className="mb-3"/>
                                            </Card> :
                                            newsList.length ?
                                                <Button type="primary" onClick={showMore}>
                                                    Yana ko'rsatish
                                                </Button> : ''
                                    }
                                </div>
                        }
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={10} xxl={8} className="position-sticky h-100">
                        <Card className="mb-3">
                            <Weather/>
                        </Card>
                        <Card>
                            <Rate/>
                        </Card>
                        <Adds/>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
export default connect((s)=>{
   return {
       loader: s?.loader
   }
})(News)
