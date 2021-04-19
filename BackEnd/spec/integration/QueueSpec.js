const Queue = require('../../adapter/bullAdapter');
const joc = jasmine.objectContaining;

describe('Testing Queue Adapter', function () {
    describe('Testing Queue', function () {

        let queue, queueNamed;

        beforeAll(() => {
            queue = new Queue('integration-test', (jobs, done) => done(null, true));
            queueNamed = new Queue("integration-test-named", {
                "test": (jobs, done) => done(null, true),
                "test2": (jobs, done) => done(null, true)
            });
        });

        beforeEach(async () => {
            await queue.clean();
        })

        describe('constructor', function () {
            it('should create a queue', function () {
                new Queue("integration-test-bis", (jobs, done) => done(null, true));
            });

            it('should create a queue', function () {
                new Queue("integration-test-named-bis", {
                    "test": (jobs, done) => done(null, true),
                    "test2": (jobs, done) => done(null, true)
                });
            });
        });

        describe('isReady()', function () {
            it('should resolve with true', async function () {
                expect(await queue.isReady()).toEqual(true);
            });

            it('should resolve with true', async function () {
                expect(await queueNamed.isReady()).toEqual(true);
            });
        });

        describe('static isReady()', function () {
            it('should resolve with true', async function () {
                expect(await Queue.isAllReady()).toEqual(true);
            });
        });

        describe('addJob(data)', function () {
            it('should create a job in the queue', async function () {
                let res = await queue.addJob({test: 'stuff'})
                expect(res).toEqual(joc({
                    data: {
                        test: 'stuff'
                    }
                }));
                expect(res).toBeInstanceOf(Queue.Job);
            });
        });

        describe('addJob(data, name)', function () {
            it('should create a job in the queue', async function () {
                let res = await queueNamed.addJob({test: 'stuff'}, "test");
                expect(res).toEqual(joc({
                    data: {
                        test: 'stuff'
                    }
                }));
                expect(res).toBeInstanceOf(Queue.Job);
            });

            it('should create a job in the queue', async function () {
                let res = await queueNamed.addJob({test: 'stuff'}, "test2");
                expect(res).toEqual(joc({
                    data: {
                        test: 'stuff'
                    }
                }));
                expect(res).toBeInstanceOf(Queue.Job);
            });
        });

        describe('addJobs(jobsData)', function () {
            it('should create a job in the queue', async function () {
                let res = await queue.addJobs([{data: {test: 'stuff1'}}, {data: {test: 'stuff2'}}, {data: {test: 'stuff3'}}]);
                expect(res).toEqual([
                    joc({data: {test: 'stuff1'}}),
                    joc({data: {test: 'stuff2'}}),
                    joc({data: {test: 'stuff3'}})
                ]);
                expect(res[0]).toBeInstanceOf(Queue.Job);
                expect(res[1]).toBeInstanceOf(Queue.Job);
                expect(res[2]).toBeInstanceOf(Queue.Job);
            });
        });

        describe('addJobs(jobsData, name)', function () {
            it('should create a job in the queue', async function () {
                let res = await queueNamed.addJobs([{data: {test: 'stuff1'}}, {data: {test: 'stuff2'}}, {data: {test: 'stuff3'}}], "test");
                expect(res).toEqual([
                    joc({data: {test: 'stuff1'}}),
                    joc({data: {test: 'stuff2'}}),
                    joc({data: {test: 'stuff3'}})
                ]);
                expect(res[0]).toBeInstanceOf(Queue.Job);
                expect(res[1]).toBeInstanceOf(Queue.Job);
                expect(res[2]).toBeInstanceOf(Queue.Job);
            });

            it('should create a job in the queue', async function () {
                let res = await queueNamed.addJobs([{data: {test: 'stuff1'}}, {data: {test: 'stuff2'}}, {data: {test: 'stuff3'}}], "test2");
                expect(res).toEqual([
                    joc({data: {test: 'stuff1'}}),
                    joc({data: {test: 'stuff2'}}),
                    joc({data: {test: 'stuff3'}})
                ]);
                expect(res[0]).toBeInstanceOf(Queue.Job);
                expect(res[1]).toBeInstanceOf(Queue.Job);
                expect(res[2]).toBeInstanceOf(Queue.Job);
            });
        });

        describe('addJobs(jobsData, name, poolSize)', function () {
            it('should create a job in the queue', async function () {
                let res = await queueNamed.addJobs([{data: {test: 'stuff1'}}, {data: {test: 'stuff2'}}, {data: {test: 'stuff3'}}], "test", 1);
                expect(res).toEqual([
                    joc({data: {test: 'stuff1'}}),
                    joc({data: {test: 'stuff2'}}),
                    joc({data: {test: 'stuff3'}})
                ]);
                expect(res[0]).toBeInstanceOf(Queue.Job);
                expect(res[1]).toBeInstanceOf(Queue.Job);
                expect(res[2]).toBeInstanceOf(Queue.Job);
            });
            it('should create a job in the queue', async function () {
                let res = await queueNamed.addJobs([{data: {test: 'stuff1'}}, {data: {test: 'stuff2'}}, {data: {test: 'stuff3'}}], "test", -20);
                expect(res).toEqual([
                    joc({data: {test: 'stuff1'}}),
                    joc({data: {test: 'stuff2'}}),
                    joc({data: {test: 'stuff3'}})
                ]);
                expect(res[0]).toBeInstanceOf(Queue.Job);
                expect(res[1]).toBeInstanceOf(Queue.Job);
                expect(res[2]).toBeInstanceOf(Queue.Job);
            });
            it('should create a job in the queue', async function () {
                let res = await queueNamed.addJobs([{data: {test: 'stuff1'}}, {data: {test: 'stuff2'}}, {data: {test: 'stuff3'}}], "test", 20);
                expect(res).toEqual([
                    joc({data: {test: 'stuff1'}}),
                    joc({data: {test: 'stuff2'}}),
                    joc({data: {test: 'stuff3'}})
                ]);
                expect(res[0]).toBeInstanceOf(Queue.Job);
                expect(res[1]).toBeInstanceOf(Queue.Job);
                expect(res[2]).toBeInstanceOf(Queue.Job);
            });
        });

        describe('getJobs()', function () {
            it('should return all the jobs', async function () {
                await queue.addJobs([{data: {test: 'stuff1'}}, {data: {test: 'stuff2'}}, {data: {test: 'stuff3'}}]);

                let res = [joc({data: {test: 'stuff1'}}), joc({data: {test: 'stuff2'}}), joc({data: {test: 'stuff3'}})];

                let g = await queue.getJobs();

                expect(g).toEqual(jasmine.arrayContaining(res));
            });
        });

        describe('clean()', function () {
            it('should return all the jobs', async function () {
                await queue.addJobs([{data: {test: 'stuff1'}}, {data: {test: 'stuff2'}}, {data: {test: 'stuff3'}}]);
                await queue.addJobs([{data: {test: 'stuff4'}}, {data: {test: 'stuff5'}}, {data: {test: 'stuff6'}}]);
                await queue.addJob({test: 'stuff7'});

                await new Promise(resolve => setInterval(() => resolve(), 200));

                await queue.clean();

                let j = await queue.getJobs();

                expect(j).toEqual([]);
            });
        });

    });

    describe('Testing Bull', function () {

    });
});