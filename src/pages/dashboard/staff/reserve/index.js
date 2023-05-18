import {Card, Table} from "antd";
import AppTable from "../../../../components/AppTabel";
import {GET_RESERVE_TO_HEMIS} from "../../../../store/types";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect, useLayoutEffect, useState} from "react";

function DashboardStaffReserve(){
    const [tableData,setTableData] = useState([]);
    const [pagination,setPagination] = useState({
        total: 0,
        current: 1,
        showSizeChanger: false
    });
    const [columns,setColumns] = useState([
        {
            dataIndex: 'tr',
            title: 'T/R',
            render:(_,col,index)=>{
                return <span>{index+1}</span>;
            }
        }, {
            dataIndex: 'full_name',
            title: 'Talaba',
        },{
            dataIndex: 'department',
            title: 'Fakultet nomi',
            render:(_,col)=>{
                return <span>{col.department?.name}</span>;
            }
        },{
            dataIndex: 'specialty',
            title: 'Mutaxasislik',
            render:(_,col)=>{
                return <span>{col.specialty?.name}</span>;
            }
        }, {
            dataIndex: 'avg_gpa',
            title: 'GPA',
        },{
            dataIndex: 'educationYear',
            title: `O'qish davri`,
            render:(_,col)=>{
                return <span>{col.educationYear?.name}</span>;
            }
        },{
            dataIndex: 'studentStatus',
            title: `O'qish holati`,
            render:(_,col)=>{
                return <span>{col.studentStatus?.name}</span>;
            }
        },{
            dataIndex: 'educationForm',
            title: `Qo'shimcha ma'lumotlar`,
            render:(_,col)=>{
                return(
                    <div>
                        <p className='m-0'>
                            O'qish turi: <strong>{col.educationForm?.name}</strong>
                        </p>
                        <p className="m-0">
                            Ilmiy daraja: <strong>{col.educationType?.name}</strong>
                        </p>
                    </div>
                )
            }
        },
    ]);
    const [data,get,loader]= useGetDynamic();
    useLayoutEffect(()=>{
        get(GET_RESERVE_TO_HEMIS);
    },[]);
    const tableChange = (pagination, filters, sorter)=>{
        get(GET_RESERVE_TO_HEMIS,{
            page: pagination.current
        });
    }
    useEffect(()=>{
        if('items' in data){
            setTableData(data.items);
        }
        if('pagination' in data){
            setPagination({
                ...data.pagination,
                showSizeChanger: false,
                total: data.pagination.totalCount
            })
        }
    },[data]);
    return(
        <Card>
            <h1>
                <strong>Ta'labalar bo'yicha ma'lumot</strong>
            </h1>
            <Table onChange={tableChange} pagination={pagination} loading={loader} dataSource={tableData} columns={columns}/>
        </Card>
    )
}
export default DashboardStaffReserve