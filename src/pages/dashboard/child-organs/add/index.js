import {Card, Skeleton, Steps} from "antd";
import {useParams} from "react-router-dom";
import React, {useEffect, useLayoutEffect, useState} from "react";
import StepOrgan from "../components/StepOrgan";
import StepUser from "../components/StepUser";
import {useDispatch, useSelector} from "react-redux";
import {useGetDynamic} from "../../../../hooks/useGet";
import {GET_ONE_ORGAN_CHILDREN, GET_ORGAN_CHILDREN} from "../../../../store/types";
import moment from "moment";

const {Step} = Steps;
function DashboardChildOrganAdd(){
    const {id} = useParams();
    const dispatch = useDispatch()
    const [data,get,loader,setLoader] = useGetDynamic();
    const {childOrganStep = 0} = useSelector(s=>s);
    useLayoutEffect(()=>{
        if(id){
            get(`${GET_ONE_ORGAN_CHILDREN}/${id}/`);
        }else{
            setLoader(false)
        }
    },[id]);
    useEffect(()=>{
        if(Object.keys(data).length){
            dispatch({
                type: 'stepOrgan',
                payload: data
            });
            if('users' in data){
                data.users = data.users.map(user=>{
                    return {
                        ...user,
                        birth_date: moment(user.birth_date)
                    }
                })
                console.log(data.users)
                dispatch({
                    type :'stepUsers',
                    payload: data.users
                });
            }
        }
    },[data]);
    return(
        <Card>
            <h4 className="mb-3">
                <strong>
                    {id ? `Yangi tashkilot qo'shish` : `Tashkilotni taxrirlash`}
                </strong>
            </h4>
            <Steps current={childOrganStep}>
                <Step title="Tashkilot ma'lumotlari"/>
                <Step title="Raxbar va hodimlar bo'limi raxbari ma'lumotlari"/>
            </Steps>
            {
                loader ?
                    <Skeleton active/>:
                    <div className="pt-5">
                        {
                            childOrganStep === 0 ?
                                <StepOrgan/> :
                                <StepUser/>
                        }
                    </div>
            }
        </Card>
    )
}
export default DashboardChildOrganAdd;