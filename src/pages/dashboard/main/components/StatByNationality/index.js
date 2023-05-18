import {Card, Skeleton} from "antd";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {useLayoutEffect, useMemo} from "react";
import {GET_STAT_BY_NATIONALITY} from "../../../../../store/types";
import {Column} from "@ant-design/plots";

function StatByNationality(){
    const [data,get,loader] = useGetDynamic();
    useLayoutEffect(()=>{
        get(GET_STAT_BY_NATIONALITY)
    },[])
    const chart = useMemo(()=>{
        const config = {
            data,
            xField: 'name',
            yField: 'total_count',
            label: {
                position: 'middle',
                style: {
                    fill: '#FFFFFF',
                    opacity: 0.6,
                },
            },
            tooltip:{
                customContent: (v,item)=>{
                    const data = item[0];
                    return <div className="p-2">
                        Jami {v} : {data?.value} ta
                    </div>
                }
            }
        };
        return <Column {...config}/>
    },[data,loader])
    return(
        <Card className="h-100">
            <h3 className="my-4">
                <strong>
                    Hodimlar millati bo'yicha
                </strong>
            </h3>
            {
                loader ?
                    <Skeleton active/>:
                    chart
            }
        </Card>
    )
}
export default StatByNationality;