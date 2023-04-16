import React, { useMemo, useState } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { keys } from "../../../model/Constant";
import apis from "../../../services/apis";
import { useCustomMutation } from "../../CommonComponents/ReactQuery/hooks";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";


export default ({ labels = [], handlerManageRole }) => {

    const [search, setSearch] = useState('')

    const data = useMemo(()=> {
        if(search != ''){
            return labels.filter(label => label.label_name.includes(search))
        }else{
            return labels
        }
    }, [search])

    const deleteLabels = useCustomMutation(
        ({ label }) => apis.label.deleteLabels(label),
        [[keys.LABELS_KEY]]
    )

    const columns = useMemo(() => [
        {
            accessorKey: 'label_name',
            header: 'Label'
        },
        {
            header: 'Roles',
            cell: ({ row }) => (
                <div className="text-center">
                    <Button className="otjs-button otjs-button-orange w-10"
                        onClick={() => handlerManageRole(row.original.label_name)}>Manage Roles
                    </Button>
                </div>
            )
        },
        {
            header: 'Delete',
            cell: ({ row }) => (
                <div className="text-center">
                    <Button className="otjs-button otjs-button-red w-10"
                        onClick={() => deleteLabels.mutate(row.original.label_name)}>Delete Label
                    </Button>
                </div>
            )
        }
    ], [handlerManageRole]);


    return (
        <>
            <InputGroup className="mt-4">
                <InputGroup.Text>Search</InputGroup.Text>
                <FormControl placeholder={"label"} type={'text'} onChange={(event) => setSearch(event.target.value)}
                    value={search} />
                <InputGroup.Text>{labels.length}</InputGroup.Text>
            </InputGroup>
            <CommonTableV8 columns={columns} data={data} />
        </>
    );

}