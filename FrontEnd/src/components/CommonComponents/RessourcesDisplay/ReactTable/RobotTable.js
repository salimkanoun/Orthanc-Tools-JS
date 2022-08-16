import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import CommonTable from "./CommonTable";

export default function RobotTable({
                                       robots,
                                       validationRobotHandler,
                                       deleteJobHandler,
                                       refreshHandler,
                                       hideValidationButton
                                   }) {
    const columns = useMemo(() => [
        {
            accessor: 'id',
            show: false,
        },
        {
            accessor: 'name',
            Header: 'Tên'
        }, {
            accessor: 'username',
            Header: 'Username'
        }, {
            accessor: 'queriesNb',
            Header: 'Số lượng truy vấn'
        }, {
            accessor: 'validation',
            Header: 'Kiểm tra tiến độ'
        }, {
            accessor: 'retrieve',
            Header: 'Truy xuất tiến độ'
        }, {
            accessor: 'state',
            Header: 'Trạng thái'
        }, {
            id: 'details',
            Header: 'Chi tiết',
            Cell: ({row}) => {
                return <Link className='nav-link otjs-button otjs-button-blue'
                             to={'/robot/' + row.values.id}> Details </Link>
            }
        }, {
            accessor: "approved",
            show: false
        }, {
            accessor: 'valid',
            Header: 'Trạng thái kiểm tra',
            show: !hideValidationButton,
            Cell: ({row}) => {
                if (row.values.valid) {
                    if (!row.values.approved) {
                        return (
                            <div className="text-center">
                                <input type="button" className='otjs-button otjs-button-green w-7'
                                       onClick={() => validationRobotHandler(row.values.id, refreshHandler)}
                                       value="Validate"/>
                            </div>
                        )
                    } else {
                        return (<p> Validated & approved </p>)
                    }
                } else {
                    return (<p> Analysing project </p>)
                }
            }
        }, {
            id: 'remove',
            Header: 'Xóa Robot',
            Cell: ({row}) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red w-10'
                               onClick={() => deleteJobHandler(row.values.id, refreshHandler)}
                               value="Remove Job"/>
                    </div>
                )
            }
        }], [validationRobotHandler, deleteJobHandler, refreshHandler, hideValidationButton])

    const data = useMemo(() => robots, [robots]);

    return <CommonTable columns={columns} tableData={data} pagination/>
}