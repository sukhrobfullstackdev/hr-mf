import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Form, Row} from "antd";
import {IconArrowLeftFill, IconArrowRightFill, IconSave} from "../../../../components/Icon";
import React from "react";

function SurveyButtons() {
    const current = useSelector(s => s.surveyCurrent || 0);
    const dispatch = useDispatch();
    const onPrev = () => {
        dispatch({
            type: "surveyCurrent",
            payload: current === 0 ? 0 : current - 1
        })
    }
    return (
        <Form.Item>
            <Row align="middle" justify="space-between">
                <Col span={12} className="text-left">
                    <Button type="primary" onClick={onPrev} disabled={current === 0}>
                        <IconArrowLeftFill/> orqaga
                    </Button>
                </Col>
                <Col span={12} className="text-right">
                    <Button htmlType="submit" type="primary">
                        {
                            current === 2 ?
                                <>
                                    <IconSave/> Saqlash
                                </> :
                                <>
                                    Keyingisi <IconArrowRightFill/>
                                </>
                        }
                    </Button>
                </Col>
            </Row>
        </Form.Item>
    )
}
export default SurveyButtons;