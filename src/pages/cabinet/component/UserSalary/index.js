import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect, useState} from "react";
import {GET_SALARY_BT_UZASBO, GET_SALARY_PENSION, GET_SALARY_VENCON, GET_USER_SALARY} from "../../../../store/types";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";
import {Button, Card, Col, DatePicker, Form, Input, Row, Skeleton, Table} from "antd";
import NoData from "../../../../components/NoData";
import Small from "../../../../styleComponents/Small";
import moment from "moment";
import {IconSearch} from "../../../../components/Icon";

function UserSalary(){
    const [type,setType] = useState('a');
    return(
        <div>
            <SalaryCategory type={type} setType={setType}/>
            {
                type === 'a' ?
                    <SalaryByUzAsbo/> :
                type === 'b' ?
                    <SalaryByOneC/> :
                type === 'c' ?
                    <SalaryPension/>:
                    <SalaryDataByYear/>
            }
        </div>
    )
}
function SalaryCategory({type, setType}){
    return(
        <Row gutter={16}>
            <Col>
                <ButtonDefault className={`salary-btn ${type === 'a' ? 'active' : ''}`} onClick={()=>setType('a')} title="UzAsbo platformasi orqali">
                    <img src="/images/uzasbo_logo.svg" alt="" style={{width: '75px'}}/>
                </ButtonDefault>
            </Col>
            <Col>
                <ButtonDefault className={`salary-btn ${type === 'b' ? 'active' : ''}`} onClick={()=>setType('b')} title="1C platformasi orqali">
                    <img src="/images/1C.svg" alt="" style={{width: '70px'}}/>
                </ButtonDefault>
            </Col>
            <Col>
                <ButtonDefault className={`salary-btn ${type === 'c' ? 'active' : ''}`} onClick={()=>setType('c')} title="Pensiya ma'lumoti">
                    <span style={{letterSpacing: '1px', fontSize: '18px'}}>
                        <strong>Pensiya ma'lumoti</strong>
                    </span>
                </ButtonDefault>
            </Col>
            <Col>
                <ButtonDefault className={`salary-btn ${type === 'd' ? 'active' : ''}`} onClick={()=>setType('d')} title="Pensiya ma'lumoti">
                    <span style={{letterSpacing: '1px', fontSize: '18px'}}>
                        <strong>Yillik oylik ma'lumoti</strong>
                    </span>
                </ButtonDefault>
            </Col>
        </Row>
    )
}
function SalaryDataByYear(){
    const [data,get,loader] = useGetDynamic();
    const [columns,setColumns] = useState([
        {
            title: 'Sana',
            dataIndex: 'Date',
        },{
            title: 'Oylik maosh',
            dataIndex: 'TaxableIncome',
        },{
            title: 'Soliq summasi',
            dataIndex: 'Incometax',
        },{
            title: 'INPS',
            dataIndex: 'INPS',
        }
    ])
    useEffect(()=>{
        const year = new Date(Date.now()).getFullYear();
        get(GET_SALARY_BT_UZASBO,{
            date: `01-01-${year}`
        })
    },[])
    return(
        <div className="my-4">
            <Table dataSource={data.Table} columns={columns}/>
        </div>
    )
}
function SalaryByUzAsbo(){
    const [data,get,loader] = useGetDynamic();
    const [date,setDate] = useState({
        date: moment(Date.now()).format('DD.MM.YYYY')
    })
    useEffect(()=>{
        get(GET_USER_SALARY,date);
    },[date]);
    const onFinish = (v)=>{
       setDate({
           date: moment(v.date).format('DD.MM.YYYY')
       });
    }
    return(
        loader ?
            <div className="py-4">
                <Skeleton active/>
            </div>:
            <div className="py-4">
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    defaultValue={{
                        date: moment(Date.now()).format('YYYY-MM-DD')
                    }}
                >
                    <Row gutter={16} align="middle">
                        <Col span={20}>
                            <Form.Item
                                name="date"
                                label="Sana bo'yicha"
                            >
                                <Input type="date"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Button htmlType="submit" type="primary" block>
                                <IconSearch/> Izlash
                            </Button>
                        </Col>
                    </Row>
                </Form>
                {
                    'Data' in data && data.Data && data.Data.length ?
                        data.Data.map(item=>{
                            return(
                                <div key={`userSalaryItemKey${item.EmployeeID}`}>
                                    <Row gutter={16}>
                                        <Col className="mb-3" xxl={12}>
                                            <Card>
                                                <p className="text-muted m-0">
                                                    Tashkilot nomi
                                                </p>
                                                <strong className="px-1">
                                                    {item.OrganizationName}
                                                </strong>
                                            </Card>
                                        </Col>
                                        <Col className="mb-3" xxl={12}>
                                            <Card>
                                                <p className="text-muted m-0">
                                                    Oylik belgilangan sana
                                                </p>
                                                <strong className="px-1">
                                                    {item.PrintDate}
                                                </strong>
                                            </Card>
                                        </Col>
                                        <Col className="mb-3" xxl={24}>
                                            {
                                                item.Table.length ?
                                                    <Row gutter={16}>
                                                        {
                                                            item.Table.map(tableItem => {
                                                                return (
                                                                    <Col xxl={24}
                                                                         className="mb-3 border-bottom"
                                                                         key={`userSalaryTableItemKey${tableItem.SubCalculationKindName.replaceAll(' ')}`}>
                                                                        <div>
                                                                            <strong>{tableItem.SubCalculationKindName}</strong>
                                                                        </div>
                                                                        <Row className="mt-2" gutter={16}>
                                                                            <Col>
                                                                                <Small size={12} className="text-muted">
                                                                                    Alohida foiz
                                                                                </Small>
                                                                                <span>
                                                                             {tableItem.Percentage} %
                                                                         </span>
                                                                            </Col>
                                                                            <Col>
                                                                                <Small size={12} className="text-muted">
                                                                                    Vaqt bo'yicha
                                                                                </Small>
                                                                                <span>
                                                                             {tableItem.FactHours}
                                                                         </span>
                                                                            </Col>
                                                                            <Col>
                                                                                <Small size={12} className="text-muted">
                                                                                    Summa
                                                                                </Small>
                                                                                <span>
                                                                             {new Intl.NumberFormat().format(tableItem.Sum)}
                                                                         </span>
                                                                            </Col>
                                                                            <Col>
                                                                                <Small size={12} className="text-muted">
                                                                                    Oylik
                                                                                </Small>
                                                                                <span>
                                                                             {tableItem.Salary}
                                                                         </span>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                )
                                                            })
                                                        }
                                                    </Row>
                                                    : ""
                                            }
                                        </Col>
                                    </Row>
                                </div>
                            )
                        })
                        :
                        <NoData size='sm' message="Bu oy uchun oylik maoshi hisoblash jarayonida yoki mavjud emas!"/>
                }
            </div>
    )
}
function SalaryByOneC(){
    const [data,get,loader] = useGetDynamic();
    const [query,setQuery] = useState(null);
    const [content,setContent] = useState('');
    useEffect(()=>{
        const dNow = Date.now();
        const d = new Date(dNow);
        d.setMonth(new Date(dNow).getMonth() + 1);
        d.setDate(0);
        const q = query || {
            start_date: moment(new Date(dNow).setDate(1)).format('YYYYMMDD'),
            end_date: moment(d).format('YYYYMMDD')
        }
        get(GET_SALARY_VENCON, q);
    },[query]);
    useEffect(()=>{
        if(Object.keys(data).length && 'OperationResult' in data && 'Результат' in data.OperationResult && data.OperationResult.Результат ){
            let a = data.OperationResult.Результат.split('\n');
            a = a.join('|').replaceAll("/",'');
            a = a.split('|');
            setContent(a);
        }
    },[data])
    const onFinish =(v)=>{
        const m = v.date.format('M');
        const y = v.date.format("YYYY");
        const dNow = Date.now();
        const d = new Date(dNow);
        d.setMonth(m);
        d.setDate(0);
        d.setFullYear(y);
        const q = query || {
            end_date: moment(d).format('YYYYMMDD'),
            start_date: moment(d.setDate(1)).format('YYYYMMDD'),
        }
     setQuery(q)
    }
    return(
        <div className="py-4">
            <Form
                layout="vertical"
                onFinish={onFinish}
                defaultValue={{
                    date: moment(Date.now()).format('YYYY-MM-DD')
                }}
            >
                <Row gutter={16} align="middle">
                    <Col span={20}>
                        <Form.Item
                            name="date"
                            label="Sana bo'yicha"
                        >
                            <DatePicker picker='month'/>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button htmlType="submit" type="primary" block>
                            <IconSearch/> Izlash
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col span={24}>
                    {
                        loader ?
                            <Skeleton active/>:
                            content.length ?
                                content.map(item=>{
                                    return(
                                        <div key={`cContent${item.replaceAll(' ','')}`}>
                                            {item}
                                        </div>
                                    )
                                })
                                :
                                <NoData message="
                                Sizning oylik maoshingiz haqidagi ma'lumotlar topilmadi!
                                Bunga sabab ma'lumot mavjud emasligi yoki sizning tel.
                                 raqamizngiz tashkilot oylik bazasiga ulanmaganligi bo'lishi mumkin."
                                />
                    }
                </Col>
            </Row>
        </div>
    )
}
function SalaryPension(){
    const [data,get,loader] = useGetDynamic();
    useEffect(()=>{
        get(GET_SALARY_PENSION);
    },[]);
    return(
        <div>
            {
                'requestpension'in data && 'Result' in data.requestpension && data.requestpension.Result === '1' ?
                    <Row>
                        <Col>
                            <strong>{data.requestpension?.surnamelatin} {data.requestpension?.namelatin} {data.requestpension?.patronymlatin}</strong>
                            <Small className="text-muted">
                                Hodim
                            </Small>
                        </Col>
                        <Col>
                            <strong>{new Intl.NumberFormat('ru-Ru').format(data.requestpension.summa)}</strong>
                            <Small className="text-muted">
                                Jamg'arma miqdori
                            </Small>
                        </Col>
                    </Row>
                     :
                    <div className="py-4">
                        <NoData size="sm" message="Pensiya bo'yicha ma'lumotlar mavjud emas!"/>
                    </div>
            }
        </div>
    )
}
export default UserSalary;