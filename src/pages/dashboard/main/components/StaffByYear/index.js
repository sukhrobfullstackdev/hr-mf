import {useGetDynamic} from "../../../../../hooks/useGet";
import {useEffect, useState} from "react";
import {GET_STAT_BY_AGE} from "../../../../../store/types";
import {Pie} from "@ant-design/charts";
import {Card, Col, Row, Select, Skeleton, TreeSelect} from "antd";
import useTree from "../../../../../hooks/useTree";
import usePositions from "../../../../../hooks/usePosition";

const {Option} = Select;
function StaffByYear(){
    const [data,get,loader] = useGetDynamic();
    const [keys,setKeys] = useState({
        between_30_and_40: "30 yoshdan 40 yoshgacha",
        greater_40: "40 yoshdan katta",
        less_30: "30 yoshgacha",
    });
    const tree = useTree();
    const positions = usePositions();
    const [pipeData,setData] = useState([]);
    const [department_id,setDepartment_id] = useState(null);
    const [position_id,setPosition_id] = useState(null);
    const [config,setConfig] = useState({
        appendPadding: 10,
        data: pipeData,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 14,
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
                content: "",
            },
        },
    });
    useEffect(()=>{
        get(GET_STAT_BY_AGE,{
            position_id,department_id
        });
    },[department_id,position_id]);
    useEffect(()=>{
        if(Object.keys(data).length){
            const d = []
            for (const key in data) {
                d.push({
                    key: keys[key],
                    value: data[key]
                })
            }
            setData(d);
        }
    },[data]);
    useEffect(()=>{
        setConfig({
            appendPadding: 10,
            data: pipeData,
            angleField: 'value',
            colorField: 'key',
            radius: 1,
            innerRadius: 0.6,
            label: {
                type: 'inner',
                offset: '-50%',
                content: '{value}',
                style: {
                    textAlign: 'center',
                    fontSize: 14,
                },
            },
            interactions: [
                {
                    type: 'element-selected',
                },
                {
                    type: 'element-active',
                },
            ],
            statistic: {
                title: false,
                content: {
                    style: {
                        whiteSpace: 'pre-wrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    },
                    content: "",
                },
            },
        })
    },[pipeData]);
    const onChooseDepartment = (value)=>{
        setDepartment_id(value);
    }
    const onChoosePositions = (value)=>{
        setPosition_id(value)
    }
    return (
        <Card>
            <h3 className="my-3">
                <strong>
                    Hodimlar yosh chegarasi bo'yicha
                </strong>
            </h3>
            <Row gutter={16} align='middle' className="mb-3">
                <Col span={24} className="mb-3">
                    <p>
                        <span>Departament / Bo'lim bo'yicha</span>
                    </p>
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
                        placeholder="Departament / bo'lim bo'yicha"
                        allowClear
                        treeDefaultExpandAll
                        treeData={tree}
                        onChange={onChooseDepartment}
                    />
                </Col>
                <Col span={24} className="mb-3">
                    <p>
                        Lavozim bo'yicha
                    </p>
                    <Select
                        allowClear
                        placeholder="Tanlang!"
                        onChange={onChoosePositions}
                        style={{width: "100%"}}
                        showSearch
                        filterOption={
                            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >-1
                        }
                    >
                        {
                            positions.map(item=>{
                                return <Option key={`position${item.id}`} value={parseInt(item.id)}>{item.position_name_uz}</Option>
                            })
                        }
                    </Select>
                </Col>
            </Row>
            {
                loader ? <Skeleton active/>:
                    <Pie {...config} />
            }
        </Card>
    )
}
export default StaffByYear