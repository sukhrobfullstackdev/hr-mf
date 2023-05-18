import {Card, Col, Row} from "antd";
import {IconExternalLink} from "../../../../../components/Icon";
import {useMemo, useState} from "react";
import NoData from "../../../../../components/NoData";
import Image from "../../../../../components/Image";
import Adds from "../../../../../components/Adds";


const month = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']

function NewsBlock({news}) {
    const [isView,setView] = useState(false)
    return useMemo(() => {
        return news.length ?
            <>
                {
                    news.map((item,i) => {
                        return (
                            <>
                                <Card key={`news${item?.id}`} className="mb-3">
                                    <Row className="mb-3" align='middle'>
                                        <Col span={12}>
                            <span className="text-muted">
                                        <span className="">
                                            {new Date(item?.pub_date).getHours()}:{new Date(item?.pub_date).getMinutes()} -
                                        </span>
                                <span className="pr-1"> {new Date(item?.pub_date).getDate()}</span>
                                <span className="pr-1">{month[new Date(item?.pub_date).getMonth()]}</span>
                                <span className="pr-1">{new Date(item?.pub_date).getFullYear()} yil</span>
                            </span>
                                        </Col>
                                        <Col span={12} className="text-right">
                                            <a className="news-link" href={`https://mf.uz/news/category/yangiliklar/${item?.slug}`} target="_blank">
                                                <IconExternalLink/>
                                            </a>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24} className="mb-3">
                                            <strong className="news-title">{item?.title}</strong>
                                        </Col>
                                        <Col span={24} className="mb-3">
                                            {
                                                item?.image && Object.keys(item.image).length ?
                                                    <img className="img-fluid rounded" src={item.image.file} alt={item.title}/> :
                                                    ""
                                            }
                                        </Col>
                                        <Col span={24}>
                                            <InnerContent content={item?.content}/>
                                        </Col>
                                    </Row>
                                </Card>
                                {
                                    news.length % i === 0 ?
                                        <div className="mb-3">
                                            <Adds type={'news'}/>
                                        </div>: ""
                                }
                            </>

                        )
                    })
                }
            </>:
            <Card>
                <NoData message="Yangiliklar mavjud emas!"/>
            </Card>
    }, [news]);
}

const InnerContent = function ({content = ''}) {
    return  <div dangerouslySetInnerHTML={{__html: content}}/>
}
export default NewsBlock