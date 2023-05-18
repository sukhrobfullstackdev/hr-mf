import {Card, Skeleton, Table} from 'antd';
import {connect, useDispatch} from "react-redux";
import {useEffect, useState} from "react";

const AppTable = ({
                      summary = null,
                      size = 'middle',
                      rowClassName = {}, data, columns, type = null,
                      tableCount = 0,
                      reload,
                      pageSize = 10,
                      loader = false,
                      search = null,
                        ...props
})=>{
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: pageSize,
        offset: 0,
        total: tableCount,
    });
    const {current} = pagination;
    const dispatch = useDispatch()
    const tableChange = (pagination, filters, sorter)=>{
        dispatch({
            type: 'tableCount',
            payload: pagination.current
        })
        dispatch({
            type: 'pageSize',
            payload: pagination.pageSize
        })
        setPagination({
            ...pagination,
            current: pagination.current,
        })
    }
    useEffect(()=>{
        if(type){
            dispatch({
                type: type,
                payload:{
                    dontPage: true,
                    current: current,
                    page_size: pageSize,
                    query: search,
                }
            });
        }
    },[reload, current, pageSize, search]);
    useEffect(()=>{
        setPagination({...pagination, hideOnSinglePage: true, total: tableCount});
    },[tableCount]);
    return (
        <Table
            onChange={tableChange}
            pagination={pagination}
            size={size}
            summary={summary}
            bordered
            loading={loader}
            dataSource={data}
            columns={columns}
            rowClassName={rowClassName}
            rowKey={col => col.id}
            {...props}
        />
    )
}
const propsToState = state => {
    return { 
        loader: state?.loader,
        tableCount: state.tableCount ? state.tableCount : 0,
        reload: state?.reload,
        pageSize: state.pageSize || 10,
    }
};
export default connect(propsToState, null)(AppTable);