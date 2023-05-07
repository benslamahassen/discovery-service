import assert from 'assert';
import { type SinonStub, stub } from 'sinon';

import { Scheduler } from '../../main/scheduler/scheduler.js';

describe('Scheduler', () => {
    let scheduler: Scheduler;
    let executionMock: SinonStub;
    let taskCron: string;

    before(() => {
        scheduler = new Scheduler();
        executionMock = stub().callsFake(() => {});
        taskCron = '* * * * *';
    });

    beforeEach(() => {
        scheduler.start();
    });

    afterEach(() => {
        scheduler.stop();
    });

    it('should push 1 or more tasks when add() is called', async () => {
        scheduler.add(taskCron, executionMock);
        scheduler.add(taskCron, executionMock);

        const tasksBeforeStop = scheduler.tasksCount();
        scheduler.stop();

        assert.equal(tasksBeforeStop, 2);
        assert.equal(scheduler.tasksCount(), 0);
    });

    it('should clear all tasks when stop() is called', async () => {
        scheduler.add(taskCron, executionMock);
        scheduler.add(taskCron, executionMock);
        scheduler.add(taskCron, executionMock);

        const tasksBeforeStoping = scheduler.tasksCount();
        scheduler.stop();

        assert.equal(tasksBeforeStoping, 3);
        assert.equal(scheduler.tasksCount(), 0);
    });
});
