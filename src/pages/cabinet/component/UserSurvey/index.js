import {useGetDynamic} from "../../../../hooks/useGet";
import {useLayoutEffect} from "react";
import {GET_USER_SURVEY} from "../../../../store/types";
import {Skeleton} from "antd";
import NoData from "../../../../components/NoData";
import {Link} from "react-router-dom";
import UserSurveyData from "../UserSurveyData";

function UserSurvey(){
    const [data,get,loader] = useGetDynamic();
    useLayoutEffect(()=>{
        get(GET_USER_SURVEY);
    },[]);
    return(
        loader ?
            <>
                <Skeleton active/>
                <Skeleton active/>
            </>
        :
          Object.keys(data).length ?
              <UserSurveyData data={data}/>:
              <>
                  <NoData message={
                      <div className="text-center">
                          <p className="m-0 text-muted">
                              Ma'lumot mavjud emas!
                          </p>
                          <div>
                              <Link to="/cabinet/info/survey">
                                  So'rovnoma shakillantirish
                              </Link>
                          </div>
                      </div>
                  } size="sm"/>
              </>
    )
}
export default UserSurvey;