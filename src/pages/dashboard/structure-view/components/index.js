import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect} from "react";
import {GET_CHILD_ORGANISATION} from "../../../../store/types";
import {IconFolderAdd, IconFolderRemove} from "../../../../components/Icon";
import {Collapse} from "antd";
import NoData from "../../../../components/NoData";
import {StructureContent} from "../components/Structure";

const {Panel} = Collapse;
function ChildOrgans(){
    const [data,get,loader] = useGetDynamic();
    useEffect(()=>{
        if(!data.length){
            get(GET_CHILD_ORGANISATION);
        }
    },[])
    return(
        <Collapse
            expandIcon={ panel =>
                <span style={{fontSize: "24px"}}>{panel.isActive ? <IconFolderRemove /> : <IconFolderAdd /> }</span>}
        >
            <Panel key={`regionDepartment`} header={<strong>Idoraviy mansub tashkilotlar</strong>}>
                {
                    data.length ?
                        data.map(item=>{
                            return (
                                <Collapse className="mb-2" key={`childOrgans${item.id}`} accordion>
                                    <Panel key={`childOrganPane${item.id}`} header={item.name}>
                                        <StructureContent data={item.department_position}/>
                                    </Panel>
                                </Collapse>
                            )
                        })
                        :
                        <NoData size="sm" message={<span className="text-muted small">Ma'lumot mavjud emas!</span>}/>
                }
            </Panel>
        </Collapse>
    )
}
export default ChildOrgans