import Style from "styled-components";
import {useState} from "react";
import {Tooltip} from "antd";

const Badge = Style.span`
    display: inline-block;
    position: relative;
    padding-left: 10px;
    &:before{
        content:'';
        width: 6px;
        height: 6px;
        border-radius:50%;
        background-color: ${p=>p.bg};
        position: absolute;
        left: 0;
        top:50%;
        transform: translateY(-50%);
    }
`
const BadgePill = Style.span`
    padding: .2rem .5rem .2rem 1rem;
    background-color: ${p=>p.bg};
    border-radius: 4px;
    color: #ffffff;
    position:relative;
    display: inline-block;
    &:before{
        content:'';
        width: 6px;
        height: 6px;
        border-radius:50%;
        background-color: #ffffff;
        position: absolute;
        left: 0.3rem;
        top:50%;
        transform: translateY(-50%);
    }
`
function StatusBadge({className = '', status = 'new', children = null, badgeType = 'dot'}){
    const [type, setType] = useState({
        new: {
            label: 'Yangi',
            color: '#36cfc9',
        },
        pending:  {
            label: "Kutish jarayonida",
            color: '#ffa940',
        },
        rejected:  {
            label: 'Qaytarilgan',
            color: '#ff7875',
        },
        in_progress:  {
            label: 'Tasdiqlash jarayonida',
            color: '#40a9ff',
        },
        in_progress_1:  {
            label: 'Arizalash jarayonida',
            color: '#40a9ff',
        },
        progress:  {
            label: 'Tasdiqlash jarayonida',
            color: '#40a9ff',
        },
        confirmed:  {
            label: 'Tasdiqlangan',
            color: '#bae637',
        },
        confirmed_1:  {
            label: 'Ariza shakillantirilgan',
            color: '#bae637',
        },
        checked:  {
            label: 'Tasdiqlash jarayonida',
            color: '#40a9ff',
        },
        approved:{
            label: 'Kelishilgan',
            color: "#3bcf36"
        }
    });
    return  (
        badgeType === 'dot' ?
            <Badge title={type[status]?.label} className={className} bg={type[status]?.color}>
                {
                    children ? children : type[status]?.label
                }
            </Badge>:
            <Tooltip title={type[status]?.label}>
                <BadgePill className={className} bg={type[status]?.color}>
                    {
                        children ? children : type[status]?.label
                    }
                </BadgePill>
            </Tooltip>
    )
}
export default StatusBadge;