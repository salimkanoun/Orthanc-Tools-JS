import React from 'react'
import { Form, FormGroup } from 'react-bootstrap'
import apis from '../../../../services/apis'
import { useCustomQuery } from '../../../CommonComponents/ReactQuery/hooks'

export default () => {

    const { data: redisServer, isLoading: isLoadingRedisServer } = useCustomQuery(
        ['redisServer'],
        () => apis.options.getRedisServer(),
    )

    if (isLoadingRedisServer) return "Loading..."

    return (
        <Form>
            <h2 className="card-title">Redis Server</h2>
            <FormGroup>
                <Form.Label >Address : </Form.Label>
                <Form.Control type="text" value={redisServer.redisAddress} disabled />
            </FormGroup>
            <FormGroup>
                <Form.Label> Port : </Form.Label>
                <Form.Control type="number" value={redisServer.redisPort} disabled />
            </FormGroup>
            <FormGroup>
                <Form.Label> Password : </Form.Label>
                <Form.Control type="password" value={redisServer.redisPassword} disabled />
            </FormGroup>
        </Form>
    )
}
