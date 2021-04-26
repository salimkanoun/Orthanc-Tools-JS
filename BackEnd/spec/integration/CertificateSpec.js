const Certificate = require("../../repository/Certificate");
const joc = jasmine.objectContaining;
const {OTJSDBEntityNotFoundException} = require("../../Exceptions/OTJSErrors");

describe("Testing Certificate Table", () => {
    beforeEach(async () => {
        await Certificate.getAllCertificates().then(x => Promise.all(x.map(e => Certificate.deleteCertificate(e.id))));
    })

    describe('createCertificate(label)', function () {
        it('should create an entity', async function () {
            let count = await Certificate.getAllCertificates().then(m => m.length);
            let res = await Certificate.createCertificate('label');
            expect(res).toEqual(joc({
                label: "label"
            }), "Resulting object is not valid");
            expect(res.id).toBeTruthy("Resulting object is not valid");
            expect(await Certificate.getAllCertificates().then(m => m.length)).toEqual(count + 1, "Expected count to increment");
        });
    });

    describe('updateCertificate(id, label, path)', function () {
        it('should update the entity', async function () {
            let res = await Certificate.createCertificate('label');
            let count = await Certificate.getAllCertificates().then(m => m.length);
            let res2 = await Certificate.updateCertificate(res.id, 'new_label', 'path');
            expect(res2).toEqual(joc({
                id: res.id,
                label: "new_label",
                path: 'path'

            }), "Resulting object is not valid");
            expect(res.id).toBeTruthy("Resulting object is not valid");
            expect(await Certificate.getAllCertificates().then(m => m.length)).toEqual(count, "Expected count to increment");
        });

        it('should throw an error', async function () {
            let count = await Certificate.getAllCertificates().then(m => m.length);
            try {
                let res = await Certificate.updateCertificate(30000, "label", "path");
                expect(false).toBe(true, "expected an exception");
            } catch (e) {
                expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException);
            }
            expect(await Certificate.getAllCertificates().then(m => m.length)).toEqual(count, "Expected count to stay the same");
        });
    });

    describe('getFromId(id)', function () {

        it('should find the right object', async function () {
            let key = await Certificate.createCertificate('label_getFromId(id)');
            let res = await Certificate.getFromId(key.id);
            expect(res).toEqual(joc({
                id: key.id, label: 'label_getFromId(id)'
            }));
        });

        it('should return null', async function () {
            let res = await Certificate.getFromId(300000);
            expect(res).toBeNull();
        });
    });

    describe('getAllCertificate()', function () {
        it('should return a list of all keys', async function () {
            await Certificate.createCertificate('label1');
            await Certificate.createCertificate('label2');
            await Certificate.createCertificate('label3');

            let res = await Certificate.getAllCertificates();
            expect(res).toEqual([
                joc({label: 'label1'}),
                joc({label: 'label2'}),
                joc({label: 'label3'})
            ]);
        });

        it('should return []', async function () {
            let res = await Certificate.getAllCertificates();
            expect(res).toEqual([]);
        });
    });

    describe('deleteCertificate(id)', function () {
        it('should remove the certificate from the table', async function () {
            let c = await Certificate.createCertificate('label');
            await Certificate.deleteCertificate(c.id);
            expect(await Certificate.getAllCertificates()).toEqual([]);
        });

        it('should throw an error', async function () {
            let count = await Certificate.getAllCertificates().then(m => m.length);
            try {
                let res = await Certificate.deleteCertificate(30000);
                expect(false).toBe(true, "expected an exception");
            } catch (e) {
                expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException);
            }
            expect(await Certificate.getAllCertificates().then(m => m.length)).toEqual(count, "Expected count to stay the same");
        });
    });
});