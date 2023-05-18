import {useMemo, useState} from "react";
import {IconCheckMark} from "../../../../../components/Icon";
import {Link} from "react-router-dom";
import {GET_IQ_TESTS, GET_MINFIN_TEST} from "../../../../../store/types";
import AppTabel from "../../../../../components/AppTabel";
import {connect, useSelector} from "react-redux";
import {Card, Tabs} from "antd";

const {TabPane} = Tabs;
function ListData(){
    const [tab,setTab] = useState('1')
    const onChange = (v)=>{
        setTab(v)
    }
    const content = useMemo(()=>{

        if(tab==='1'){
            return  <IqTestList/>
        }
        return <MinFinTest/>
    },[tab])
    return(
        <Card>
            <Tabs defaultActiveKey="1" onChange={onChange}>
                <TabPane tab="IQ test" key="1">
                    {content}
                </TabPane>
                <TabPane tab="Moliya Vazirligi testi" key="2">
                    {content}
                </TabPane>
            </Tabs>

        </Card>
    )
}
function IqTestList(){
    const iqTests = useSelector(s=>s.iqTests || []);
    const loader = useSelector(s=>s.loader);
    const [columns,setColumns] = useState([
        {
            title: "Iq Test nomi",
            dataIndex: 'name',
        },
        {
            title: "Vaqti (min)",
            dataIndex: 'duration',
        },
        {
            title: "Savollar soni",
            dataIndex: 'total_questions',
        },
        {
            title: "Urunishlar soni",
            dataIndex: 'tries',
        },
        {
            title: "O'rtacha ball",
            dataIndex: 'average_result',
            render: (_,col)=>{
                return `${col.average_result}%`
            }
        },
        {
            title: "Amal qilish sana",
            dataIndex: 'dateof_issue',
            render:(_,col)=>{
                return(
                    <div className="text-right">
                        <Link to={`${col.id}`} className='ant-btn ant-btn-primary ant-btn-sm mr-2' size="small">
                            <IconCheckMark/> Yechish
                        </Link>
                    </div>
                )
            }
        },
    ]);
   return(
       <AppTabel data={iqTests} type={GET_IQ_TESTS} columns={columns} loader={loader}/>
   )
}
function MinFinTest(){
    const [columns,setColumns] = useState([
        {
            title: "T/R",
            dataIndex: 'id',
        },{
            title: "Savollar",
            dataIndex: 'name',
        },
    ]);
    const minFinTest = useSelector(s=>s.minFinTest || []);
    const loader = useSelector(s=>s.loader);
   return(
       <AppTabel data={minFinTest} type={GET_MINFIN_TEST} columns={columns} loader={loader}/>
   )
}
const stp = (state)=>{
    return{
        loader: state.loader,
        iqTests: state.iqTests
    }
}
export default connect(stp)(ListData)