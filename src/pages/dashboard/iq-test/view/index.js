import {Link, useParams} from "react-router-dom";
import {useEffect} from "react";
import {GET_ONE_IQ_TEST} from "../../../../store/types";
import {useGetDynamic} from "../../../../hooks/useGet";
import ListQuestions from "../components/ListQuestions";
import {Card, Skeleton} from "antd";
import {IconChevronLeft} from "../../../../components/Icon";

function ViewIqTest(){
    const {id} = useParams();
    const [test,get,loader] = useGetDynamic();
    useEffect(()=>{
        get(`${GET_ONE_IQ_TEST}${id}`);
    },[id]);
    return (
        loader ?
            <Card>
                <Skeleton active/>
            </Card>
        :
            <>
                <ListQuestions questions={test.questions}/>
                <p className="text-right">
                    <Link to='/dashboard/iq-test'>
                        <IconChevronLeft/> Ortga qayrish
                    </Link>
                </p>
            </>
    )
}
export default ViewIqTest;