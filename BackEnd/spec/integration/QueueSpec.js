const Queue = require('../../adapter/bullAdapter');
const joc = jasmine.objectContaining;

describe('Testing Queue Adapter', function () {

    let queue, queueNamed;

    beforeAll(() => {
        queue = new Queue('integration-test', async (jobs, done) => {
            jobs.progress(100);
            done(null, true)
        });
        queueNamed = new Queue("integration-test-named", {
            "test": (jobs, done) => done(null, true),
            "test2": (jobs, done) => done(null, true)
        });
    });

    describe('Testing Queue', function () {

        beforeEach(async () => {
            await queue.clean();
        });

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

                await new Promise(resolve => setTimeout(() => resolve(), 200));

                await queue.clean();

                let j = await queue.getJobs();

                expect(j).toEqual([]);
            });
        });

    });

    describe('Testing Job', function () {
        let job1;
        let job2;

        beforeAll(async () => {
            queue.clean();
            await queue.addJob({test: 'stuff'});
            await queue.addJobs([{data: {test: 'stuff'}}]);
            await new Promise(resolve => setTimeout(() => resolve(), 200));
            [job1, job2] = await queue.getJobs();
        });

        describe('getState()', function () {
            it('should return a valid state', async function () {
                expect(Object.values(Queue.JOB_STATES)).toContain(await job1.getState());
            });

            it('should return a valid state', async function () {
                expect(Object.values(Queue.JOB_STATES)).toContain(await job2.getState());
            });
        });

        describe('progress()', function () {
            it('should return the right progress', async function () {
                expect(await job1.progress()).toEqual(100);
            });

            it('should return the right progress', async function () {
                expect(await job2.progress()).toEqual(100);
            });
        });

        describe('finished()', function () {
            it('should return the right return value', async function () {
                expect(await job1.finished()).toEqual(true);
            });

            it('should return the right return value', async function () {
                expect(await job2.finished()).toEqual(true);
            });
        });
    });
});