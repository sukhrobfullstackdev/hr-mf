import useRegion from "../../../../../hooks/useRegion";
import {IconFolderAdd, IconFolderRemove} from "../../../../../components/Icon";
import {Card, Collapse, Skeleton} from "antd";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {useEffect, useState} from "react";
import {GET_ORGAN_BY_REGION} from "../../../../../store/types";
import {StructureContent} from "../Structure";
import NoData from "../../../../../components/NoData";

const {Panel} = Collapse;
function Regions(){
    const regions = useRegion();
    return(
        <div className="py-4">
            <Collapse
                expandIcon={ panel =>
                    <span style={{fontSize: "24px"}}>{panel.isActive ? <IconFolderRemove /> : <IconFolderAdd /> }</span>}
            >
                <Panel key={`regionDepartment`} header={<strong>Hududiy Moliya Organlari</strong>}>
                    {
                        regions.map(item=>{
                            return (
                                <Collapse
                                    className="mb-3"
                                    accordion
                                    expandIcon={ panel =>
                                        <span style={{fontSize: "24px"}}>{panel.isActive ? <IconFolderRemove /> : <IconFolderAdd /> }</span>}
                                >
                                    <Panel key={`accardionRegion${item.id}`}  header={item.name_uz_lat}>
                                        <RegionSections regionId={item.id}/>
                                    </Panel>
                                </Collapse>
                            )
                        })
                    }
                </Panel>
            </Collapse>
        </div>
    )
}
function RegionSections({regionId}){
    const [organ,get,loader] = useGetDynamic();
    useEffect(()=>{
        if(!organ.length){
            get(GET_ORGAN_BY_REGION,{
                region_id: regionId
            })
        }
    },[]);
    return(
        <div>

            {
                loader ?
                    <Card>
                        <Skeleton active/>
                    </Card> :
                    organ.length ?
                        <Collapse accordion>
                            {
                                organ.map(or=>{
                                    return (
                                        <Panel key={`subOrganByRegion${or.id}`} header={or.name}>
                                            <StructureContent data={or.department_position}/>
                                        </Panel>
                                    )
                                })
                            }
                        </Collapse>

                        :
                    <NoData size="sm" message={<span className='text-muted small'>Korxona yoki tashkilotlar mavjud emas!</span>}/>
            }
        </div>
    )
}
export default Regions;