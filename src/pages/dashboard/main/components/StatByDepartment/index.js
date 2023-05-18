import {useGetDynamic} from "../../../../../hooks/useGet";
import {useLayoutEffect} from "react";
import {GET_STAT_BY_DEPARTMENT} from "../../../../../store/types";
import {Card, Skeleton} from "antd";
import {Pie} from "@ant-design/charts";


function StatByDepartment(){
    const [data,get,loader] = useGetDynamic();
    useLayoutEffect(()=>{
        if(!data.length){
            get(GET_STAT_BY_DEPARTMENT);
        }
    },[]);
    const config = {
        appendPadding: 10,
        data,
        angleField: 'num_of_deps',
        colorField: 'name_uz',
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };
    return  loader ?
                <Card>
                    <Skeleton active/>
                </Card> :
                <Card className="h-100">
                    <h3 className="mb-3">
                        <strong>
                            Departamentlar va bo'limlar
                        </strong>
                    </h3>
                    <Pie {...config} />
                </Card>
}
export default StatByDepartment;