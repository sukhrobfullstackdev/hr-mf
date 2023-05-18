import {Card, Col, Row, Skeleton, TreeSelect} from "antd";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {useEffect, useMemo, useState} from "react";
import {GET_STAT} from "../../../../../store/types";
import {Bar} from "@ant-design/plots";
import useTree from "../../../../../hooks/useTree";

function StatByPosition() {
    const [data,get,loader] = useGetDynamic();
    const [config,setConfig] = useState({
        data: 'statistic_total' in data ? data.statistic_total : [],
        xField: 'total_staff',
        yField: 'position_name_uz',
        legend: {
            position: 'top-left',
        },
        tooltip:{
            customContent: (v,item)=>{
                const data = item[0];
                return <div className="p-2">
                    Jami {v} : {data?.value} ta
                </div>
            }
        }
    });
    const [departmentId,setDepartmentId] = useState(null);
    const tree = useTree();
    useEffect(()=>{
        get(GET_STAT,departmentId ?
            {
                department_id: departmentId
            }:{});
    },[departmentId]);
    useEffect(()=>{
        setConfig({
            ...config,
            data: data,
            xField: 'total_count',
            yField: 'position_name',
            seriesField: 'position_name_uz',
            legend: false,
        })
    },[data]);
    const onChooseDepartment = (value)=>{
        if(value && value !=''){
            setDepartmentId(value);
        }else{
            setDepartmentId(null)
        }
    }
    const line = useMemo(()=>{
        return <Bar {...config} />
    },[config]);
    return  <Card>
                <h3 className="mb-3">
                    <strong>
                        Lavozimlar bo'yicha hodimlar soni
                    </strong>
                </h3>
                <Row gutter={16} align='middle' className="mb-3">
                    <Col span={6}>
                        <span>Departament / Bo'lim bo'yicha</span>
                    </Col>
                    <Col span={18}>
                        <TreeSelect
                            showSearch
                            filterTreeNode={(search, item) => {
                                return item.label.toLowerCase().indexOf(search.toLowerCase()) > -1;
                            }}
                            fieldNames={{
                                title: 'label',
                                value: 'id',
                                children: 'children'
                            }}
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            allowClear
                            treeDefaultExpandAll
                            treeData={tree}
                            onChange={onChooseDepartment}
                        />
                    </Col>
                </Row>
                {
                   loader ?
                    <Skeleton active/>:
                    line
                }
            </Card>
}
export default StatByPosition;