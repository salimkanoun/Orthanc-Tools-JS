const Endpoint = require("../../repository/Endpoint");
const SshKey = require("../../repository/SshKey");
const joc = jasmine.objectContaining;
const {OTJSDBEntityNotFoundException} = require("../../Exceptions/OTJSErrors");


describe("Testing Endpoint Table", () => {
    let sshKey;
    beforeAll(async () => {
        sshKey = (await SshKey.getAll())[0];
        if (!sshKey) sshKey = await SshKey.saveKey(null, 'label', 'path', null);
    })

    beforeEach(async () => {
        await Endpoint.getAllEndpoints().then(x => Promise.all(x.map(e => Endpoint.removeEndpoint(e.id))));
    })

    describe('saveEndpoint(id, label, host, targetFolder, protocol, port, identifiants, pass, digest, sshKey, ssl)', function () {
        it('should create an entity', async function () {
            let count = await Endpoint.getAllEndpoints().then(m => m.length);
            let res = await Endpoint.saveEndpoint(null, 'label', 'host', 'targetFolder', 'protocol', 1664 , 'identifiants', true, true, sshKey.id, true);
            expect(res).toEqual(joc({
                label: 'label',
                host: 'host',
                targetFolder: 'targetFolder',
                protocol: 'protocol',
                port: 1664,
                identifiants: 'identifiants',
                pass: true,
                digest: true,
                sshKey: sshKey.id,
                ssl: true
            }), "Resulting object is not valid");
            expect(res.id).toBeTruthy("Resulting object is not valid");
            expect(await Endpoint.getAllEndpoints().then(m => m.length)).toEqual(count + 1, "Expected count to increment");
        });

        it('should create an entity', async function () {
            let count = await Endpoint.getAllEndpoints().then(m => m.length);
            let res = await Endpoint.saveEndpoint(null, 'label', 'host', 'targetFolder', 'protocol', 1664, 'identifiants', true, true, null, true);
            expect(res).toEqual(joc({
                label: 'label',
                host: 'host',
                targetFolder: 'targetFolder',
                protocol: 'protocol',
                port: 1664,
                identifiants: 'identifiants',
                pass: true,
                digest: true,
                sshKey: null,
                ssl: true
            }), "Resulting object is not valid");
            expect(res.id).toBeTruthy("Resulting object is not valid");
            expect(await Endpoint.getAllEndpoints().then(m => m.length)).toEqual(count + 1, "Expected count to increment");
        });

        it('should update the entity', async function () {
            let initial = await Endpoint.saveEndpoint(null, 'label', 'host', 'targetFolder', 'protocol', 1664, 'identifiants', true, true, sshKey.id, true);
            let count = await Endpoint.getAllEndpoints().then(m => m.length);
            let res = await Endpoint.saveEndpoint(initial.id, 'label2', null, 'targetFolderChanged', 'protocol', 0666, 'identifiants', true, false, sshKey.id, true);
            expect(res).toEqual(joc({
                label: 'label2',
                host: 'host',
                targetFolder: 'targetFolderChanged',
                protocol: 'protocol',
                port: 0666,
                identifiants: 'identifiants',
                pass: true,
                digest: false,
                sshKey: sshKey.id,
                ssl: true
            }), "Resulting object is not valid");
            expect(await Endpoint.getAllEndpoints().then(m => m.length)).toEqual(count, "Expected count to stay the same");
        });

        it('should update the entity', async function () {
            let initial = await Endpoint.saveEndpoint(null, 'label', 'host', 'targetFolder', 'protocol', 1664, 'identifiants', true, true, sshKey.id, true);
            let count = await Endpoint.getAllEndpoints().then(m => m.length);
            let res = await Endpoint.saveEndpoint(initial.id, 'label2', null, 'targetFolderChanged', 'protocol', 1665, 'identifiants', true, false, null, null);
            expect(res).toEqual(joc({
                label: 'label2',
                host: 'host',
                targetFolder: 'targetFolderChanged',
                protocol: 'protocol',
                port: 1665,
                identifiants: 'identifiants',
                pass: true,
                digest: false,
                sshKey: null,
                ssl: true
            }), "Resulting object is not valid");
            expect(await Endpoint.getAllEndpoints().then(m => m.length)).toEqual(count, "Expected count to stay the same");
        });

        it('should throw an error 1', async function () {
            let count = await Endpoint.getAllEndpoints().then(m => m.length);
            try {
                let res = await Endpoint.saveEndpoint(3000, 'label2', null, 'targetFolderChanged', 'protocol', 1664, 'identifiants', true, false, sshKey.id, true);
                expect(false).toBe(true, "expected an exception");
            } catch (e) {
                expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException);
            }
            expect(await Endpoint.getAllEndpoints().then(m => m.length)).toEqual(count, "Expected count to stay the same");
        });

        it('should throw an error 2', async function () {
            let count = await Endpoint.getAllEndpoints().then(m => m.length);
            try {
                let res = await Endpoint.saveEndpoint(null, 'label2', null, 'targetFolderChanged', 'protocol', 1664, 'identifiants', true, false, -9, true);
                expect(false).toBe(true, "expected an exception");
            } catch (e) {
                expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException);
            }
            expect(await Endpoint.getAllEndpoints().then(m => m.length)).toEqual(count, "Expected count to stay the same");
        });
    });

    describe('getFromId(id)', function () {

        it('should find the right object', async function () {
            let init = await Endpoint.saveEndpoint(null, 'label', 'host', 'targetFolder', 'protocol', 1664, 'identifiants', true, true, null, true);
            let res = await Endpoint.getFromId(init.id);
            expect(res).toEqual(joc({
                id: init.id,
                label: 'label',
                host: 'host',
                targetFolder: 'targetFolder',
                protocol: 'protocol',
                port: 1664,
                identifiants: 'identifiants',
                pass: true,
                digest: true,
                sshKey: null,
                ssl: true
            }), "Resulting object is not valid");
        });

        it('should return null', async function () {
            let res = await Endpoint.getFromId(300000);
            expect(res).toBeNull();
        });
    });

    describe('getAll()', function () {
        it('should return a list of all keys', async function () {
            await Endpoint.saveEndpoint(null, 'label1', 'host', 'targetFolder', 'protocol', 1664, 'identifiants', true, true, null, true);
            await Endpoint.saveEndpoint(null, 'label2', 'host', 'targetFolder', 'protocol', 1665, 'identifiants', true, true, null, true);
            await Endpoint.saveEndpoint(null, 'label3', 'host', 'targetFolder', 'protocol', 1666, 'identifiants', true, true, null, true);

            let res = await Endpoint.getAllEndpoints();
            expect(res).toEqual([
                joc({label: 'label1'}),
                joc({label: 'label2'}),
                joc({label: 'label3'})
            ]);
        });

        it('should return []', async function () {
            let res = await Endpoint.getAllEndpoints();
            expect(res).toEqual([]);
        });
    });

    describe('delete(id)', function () {
        it('should remove the key from the table', async function () {
            let e = await Endpoint.saveEndpoint(null, 'label1', 'host', 'targetFolder', 'protocol', 1664, 'identifiants', true, true, null, true);
            await Endpoint.removeEndpoint(e.id);
            expect(await Endpoint.getAllEndpoints()).toEqual([]);
        });

        it('should throw an error', async function () {
            let count = await Endpoint.getAllEndpoints().then(m => m.length);
            try {
                let res = await Endpoint.removeEndpoint(30000);
                expect(false).toBe(true, "expected an exception");
            } catch (e) {
                expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException);
            }
            expect(await Endpoint.getAllEndpoints().then(m => m.length)).toEqual(count, "Expected count to stay the same");
        });
    });
});