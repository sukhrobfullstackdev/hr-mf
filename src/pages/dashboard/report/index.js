import {useGetDynamic} from "../../../hooks/useGet";
import {useEffect, useState} from "react";
import {GET_REPORT} from "../../../store/types";
import {Card, Collapse, Skeleton, Table} from "antd";
import NoData from "../../../components/NoData";
import AppTabel from "../../../components/AppTabel";

const {Panel} = Collapse;

function Report() {
    const [data, get, loader] = useGetDynamic();
    useEffect(() => {
        get(GET_REPORT);
    }, []);
    return (
        <div>
            <h1>
                <strong>Shtatlar jadvali</strong>
            </h1>
            {
                loader ?
                    <>
                        <Card>
                            <Skeleton active/>
                        </Card>
                    </> :
                    data.length ?
                        data.map((item) => {
                            return(
                                <ReportContent item={item} key={`reportKey${item.id}`}/>
                            )
                        })
                        :
                        <Card>
                            <NoData size="sm"/>
                        </Card>

            }
        </div>
    )
}
const ReportContent=({item})=>{
    return(
        <Card className="mb-3">
            <div className="text-center mb-3">
                <strong>{item.label}</strong>
            </div>
            <Content item={item.positions}/>
        </Card>
    )
}
const Content=({item = []})=>{
    const [column,setColumn] = useState([
        {
            title: 'Lavozim',
            dataIndex: 'position_name',
            width: '30%'
        },{
            title: 'Shtat birligi',
            dataIndex: 'count',
            render:(_,col)=> <div className="text-right">{col.count}</div>
        },{
            title: `YTS bop'yicha razryad`,
            dataIndex: 'razryad_coefficient',
            render: (_,col)=>{
                return (
                    <div className="text-right">
                        {
                            col.razryad_coefficient || 'x'
                        }
                        {
                            col.razryad_subtract ? `-${col.razryad_subtract}%`: ''
                        }
                    </div>
                )
            }
        },{
            title: 'Tarif koefitsenti',
            dataIndex: 'razryad_value',
            render:(_,col)=> <div className="text-right">{col.razryad_value || 'x'}</div>
        },{
            title: "Lavozim bo'yicha oylik ish xaqqi",
            dataIndex: 'salary',
            render:(_,col)=> <div className="text-right">{col.salary ? Intl.NumberFormat().format(col.salary) :'x'}</div>
        },{
            title: 'Jami ish xaqqi',
            dataIndex: 'sum_salary',
            render:(_,col)=> <div className="text-right">{col.sum_salary ? Intl.NumberFormat().format(col.sum_salary) :'x'}</div>
        },
    ]);
    const summary = (data)=>{
        const count = data.map(v=>v.count).reduce((a, b) => a + b, 0);
        const summaSalary = data.map(v=>v.salary ? parseFloat(v.salary) : 0).reduce((a,b) => a + b, 0)
        const salary = data.map(v=>v.sum_salary ? parseFloat(v.sum_salary) : 0).reduce((a,b) => a + b, 0)
        return(
            <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                    <strong>Jami</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                    <p className="m-0 text-right">
                        <strong>{count}</strong>
                    </p>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                    <p className="m-0 text-right">
                        <strong>x</strong>
                    </p>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                    <p className="m-0 text-right">
                        <strong>x</strong>
                    </p>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                    <p className="m-0 text-right">
                        <strong>
                            {Intl.NumberFormat().format(summaSalary)}
                        </strong>
                    </p>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                    <p className="m-0 text-right">
                        <strong>
                            {Intl.NumberFormat().format(salary)}
                        </strong>
                    </p>
                </Table.Summary.Cell>
            </Table.Summary.Row>
        )
    }
    return (
        <AppTabel
            summary={(data)=>summary(data)}
            size="small"
            data={item}
            columns={column}/>
    )
}

export default Report;