const SshKey = require("../../repository/SshKey");
const joc = jasmine.objectContaining;
const {OTJSDBEntityNotFoundException} = require("../../Exceptions/OTJSErrors");


describe("Testing SshKey Table", () => {
    beforeEach(async () => {
        await SshKey.getAll().then(x => Promise.all(x.map(e => SshKey.delete(e.id))));
    })

    describe('saveKey(id, label, path, pass)', function () {
        it('should create an entity', async function () {
            let count = await SshKey.getAll().then(m => m.length);
            let res = await SshKey.saveKey(null, 'label', 'path', "pass");
            expect(res).toEqual(joc({
                id: res.id,
                label: "label",
                path: "path",
                pass: "pass"
            }), "Resulting object is not valid");
            expect(res.id).toBeTruthy("Resulting object is not valid");
            expect(await SshKey.getAll().then(m => m.length)).toEqual(count + 1, "Expected count to increment");
        });

        it('should update the key', async function () {
            let initial = await SshKey.saveKey(null, 'label', 'path', "pass");
            let count = await SshKey.getAll().then(m => m.length);
            let res = await SshKey.saveKey(initial.id, 'label2', null, "pass2");
            expect(res).toEqual(joc({
                id: initial.id,
                label: "label2",
                path: "path",
                pass: "pass2"
            }), "Resulting object is not valid");
            expect(await SshKey.getAll().then(m => m.length)).toEqual(count, "Expected count to stay the same");
        });

        it('should throw an error', async function () {
            let count = await SshKey.getAll().then(m => m.length);
            try {
                let res = await SshKey.saveKey(30000, "label", "path", "pass");
                expect(false).toBe(true, "expected an exception");
            } catch (e) {
                expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException);
            }
            expect(await SshKey.getAll().then(m => m.length)).toEqual(count, "Expected count to stay the same");
        });
    });

    describe('getFromId(id)', function () {

        it('should find the right object', async function () {
            let key = await SshKey.saveKey(null, 'label_getFromId(id)', 'path_getFromId(id)', "pass_getFromId(id)");
            let res = await SshKey.getFromId(key.id);
            expect(res).toEqual(joc({
                id: key.id, label: 'label_getFromId(id)', path: 'path_getFromId(id)', pass: "pass_getFromId(id)"
            }));
        });

        it('should return null', async function () {
            let res = await SshKey.getFromId(300000);
            expect(res).toBeNull();
        });
    });

    describe('getAll()', function () {
        it('should return a list of all keys', async function () {
            await SshKey.saveKey(null, 'label1', 'path', "pass");
            await SshKey.saveKey(null, 'label2', 'path', "pass");
            await SshKey.saveKey(null, 'label3', 'path', "pass");

            let res = await SshKey.getAll();
            expect(res).toEqual([
                joc({label: 'label1', path: 'path', pass: 'pass'}),
                joc({label: 'label2', path: 'path', pass: 'pass'}),
                joc({label: 'label3', path: 'path', pass: 'pass'})
            ])
        });
    });

    describe('delete(id)', function () {
        it('should remove the key from the table', async function () {
            let k = await SshKey.saveKey(null, 'label', 'path', "pass");
            await SshKey.delete(k.id);
            expect(await SshKey.getAll()).toEqual([]);
        });

        it('should throw an error', async function () {
            let count = await SshKey.getAll().then(m => m.length);
            try {
                let res = await SshKey.delete(30000);
                expect(false).toBe(true, "expected an exception");
            } catch (e) {
                expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException);
            }
            expect(await SshKey.getAll().then(m => m.length)).toEqual(count, "Expected count to stay the same");
        });
    });
});