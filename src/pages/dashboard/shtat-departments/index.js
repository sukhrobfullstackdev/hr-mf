import { useGetDynamic } from "../../../hooks/useGet";
import { useEffect, useState } from "react";
import { GET_SHTAT_REPORT, GET_REPORT } from "../../../store/types";
import { Card, Collapse, Skeleton, Table, Row, Col, InputNumber } from "antd";
import NoData from "../../../components/NoData";
import AppTabel from "../../../components/AppTabel";
import styled from 'styled-components';

const Header = styled.div`
text-align:center;
`

const HeaderLeft = styled.div`
text-align: Left;
// padding: 10px;
// text-align: center;
`

const HeaderRight = styled.div`
//   text-align: right;
//   padding: 10px;
//   margin-left: 30px;
`

const ReportContent = ({ item }) => {
    return (
        <Card className="mb-3">
            <div className="text-center mb-3">
                <strong>{item.label}</strong>
            </div>
            <Content item={item.positions} />
        </Card>
    )
}
const Content = ({ item = [] }) => {
    console.log(item);
    const [column, setColumn] = useState([

        {
            title: 'Lavozim',
            dataIndex: 'position_name',
            width: '30%'
        }, {
            title: 'Shtat birligi',
            dataIndex: 'count',
            render: (_, col) => <div className="text-right">{col.count}</div>
        }, {
            title: `YTS bop'yicha razryad`,
            dataIndex: 'razryad_coefficient',
            render: (_, col) => {
                const SubVal = col.razryad_subtract + '-' + col.razryad_value + '%';
                const val = col.razryad_value;
                return (
                    <div className="text-right">
                        
                        {
                            col.razryad_subtract !==0 ? SubVal : val
                        }

                    </div>

                )
            }
        }, {
            title: 'Tarif koefitsenti',
            dataIndex: 'razryad_coefficient',
            render: (_, col) => <div className="text-right">{col.razryad_coefficient || 'x'}</div>
        }, 
        {
            title: "To`g`irlovchi koefitsenti",
            dataIndex: 'razryad_coefficient',
            render: (_, col) => <InputNumber size="small" style={{width:'70%', float:'right'}} min={1} max={10}/>
        }, 
        {
            title: "Lavozim bo'yicha oylik ish xaqqi",
            dataIndex: 'minimal_salary',
            render: (_, col) =>
                <div className="text-right">
                    {
                        col.minimal_salary ? Intl.NumberFormat().format(col.minimal_salary) : 'x'
                    }
                </div>
        }, {
            title: "Rag'batlantirish koeffitsienti",
            dataIndex: 'bonus_salary',
            render: (_, col) =>
                <div className="text-right">
                    {
                        col.bonus_salary ? Intl.NumberFormat().format(col.bonus_salary) : 'x'
                    }
                </div>
        }, {
            title: 'Jami ish xaqqi',
            dataIndex: 'base_salary',
            render: (_, col) => <div className="text-right">{col.base_salary ? Intl.NumberFormat().format(col.base_salary) : 'x'}</div>
        },
    ]);
    const summary = (data) => {
        const count = data.map(v => v.count).reduce((a, b) => a + b, 0);
        const summaSalary = data.map(v => v.minimal_salary ? parseFloat(v.minimal_salary) : 0).reduce((a, b) => a + b, 0)
        const summaBonusSalary = data.map(v => v.bonus_salary ? parseFloat(v.bonus_salary) : 0).reduce((a, b) => a + b, 0)
        const salary = data.map(v => v.base_salary ? parseFloat(v.base_salary) : 0).reduce((a, b) => a + b, 0)
        return (
            <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                    <strong>Jami</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                    <p className="m-0 text-right">
                        <strong>{count}</strong>
                    </p>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                    <p className="m-0 text-right">
                        <strong>x</strong>
                    </p>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                    <p className="m-0 text-right">
                        <strong>x</strong>
                    </p>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                    <p className="m-0 text-right">
                        <strong>x</strong>
                    </p>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                    <p className="m-0 text-right">
                        <strong>
                            {Intl.NumberFormat().format(summaSalary)}
                        </strong>
                    </p>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                    <p className="m-0 text-right">
                        <strong>
                            {Intl.NumberFormat().format(summaBonusSalary)}
                        </strong>
                    </p>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                    <p className="m-0 text-right">
                        <strong>
                            {Intl.NumberFormat().format(salary)}
                        </strong>
                    </p>
                </Table.Summary.Cell>
            </Table.Summary.Row>
        )
    }
    return (
        <AppTabel
            summary={(data) => summary(data)}
            size="small"
            data={item}
            pagination={false}
            columns={column}
        />
    )
}

const ShtatDepartments = () => {
    const [data, get, loader] = useGetDynamic();
    // console.log(data.departments);
    useEffect(() => {
        get(GET_SHTAT_REPORT);
        // get(GET_REPORT);
    }, []);
    return (
        <div>
            <Header>
                <h1>
                    <strong>Shtatlar jadvali</strong>
                </h1>
            </Header>

            {/* <TopData> */}
            <Row gutter={[15, 0]}>
                <Col md={6} className="text-center ml-3">
                    <HeaderLeft>
                        <strong>Tashkilotning to'liq nomi:</strong>
                    </HeaderLeft>
                    <HeaderLeft>
                        <strong>To'liq manzili:</strong>
                    </HeaderLeft>
                    <HeaderLeft>
                        <strong>Budjet darajasi:</strong>
                    </HeaderLeft>
                    <HeaderLeft>
                        <strong>Bo'lim:</strong>
                    </HeaderLeft>
                    <HeaderLeft>
                        <strong>Kichik bo'lim:</strong>
                    </HeaderLeft>
                    <HeaderLeft>
                        <strong>Bob:</strong>
                    </HeaderLeft>
                </Col>
                <Col md={12}>
                    <HeaderRight>{data.organization_name}</HeaderRight>
                    <HeaderRight>{data.address}</HeaderRight>
                    <HeaderRight>{data.degree}</HeaderRight>
                    <HeaderRight>{data.department_code}</HeaderRight>
                    <HeaderRight>{data.small_department_code}</HeaderRight>
                    <HeaderRight>{data.chapter_code}</HeaderRight>
                </Col>
            </Row>
            {/* </TopData> */}
            {
                loader ?
                    <>
                        <Card>
                            <Skeleton active />
                        </Card>
                    </> :
                    data.departments?
                        data.departments.map((item) => {
                            // console.log(data);
                            return (
                                <ReportContent item={item} key={`reportKey${item.id}`} />
                            )
                        })
                        :
                        <Card>
                            <NoData size="sm" />
                        </Card>

            }
        </div>
    )
}

export default ShtatDepartments