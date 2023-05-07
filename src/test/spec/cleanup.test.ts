/* eslint-disable import/extensions */
import {
    Config,
    Logger,
    ProcessEnvConfig,
    StandardLogger,
} from '@ubio/framework';
import assert from 'assert';
import { Mesh } from 'mesh-ioc';
import * as sinon from 'sinon';

import { InstanceRepository } from '../../main/repositories/inctance.js';
import { Scheduler } from '../../main/scheduler/scheduler.js';
import { Cleanup } from '../../main/service/cleanup.js';

describe('Cleanup service', () => {
    let mesh: Mesh;
    let instanceRepository: InstanceRepository;
    let cleanup: Cleanup;
    let instanceMock: any;
    let logger: Logger;
    let getInstancesByAgeStub: sinon.SinonStub;
    let deleteManyInstancesByIdsStub: sinon.SinonStub;

    before(() => {
        mesh = new Mesh();
        mesh.service(Cleanup);
        mesh.service(Scheduler);
        mesh.service(InstanceRepository);
        mesh.service(Config, ProcessEnvConfig);
        mesh.service(Logger, StandardLogger);
    });

    beforeEach(() => {
        const now = new Date();
        instanceMock = {
            id: '1',
            group: 'test',
            meta: {},
            createdAt: new Date(
                now.getTime() - 2 * 60 * 60 * 1000
            ).toISOString(),
            updatedAt: new Date(
                now.getTime() - 2 * 60 * 60 * 1000
            ).toISOString(),
        };

        instanceRepository = mesh.resolve(InstanceRepository);
        cleanup = mesh.resolve(Cleanup);
        logger = mesh.resolve(Logger);
        getInstancesByAgeStub = sinon.stub(
            instanceRepository,
            'getInstancesByAge'
        );
        deleteManyInstancesByIdsStub = sinon.stub(
            instanceRepository,
            'deleteManyInstancesByIds'
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Cleanup Service', () => {
        // Tests that the cleanup function deletes instances older than the specified age.
        it('test_cleanup_deletes_instances_older_than_specified_age', async () => {
            getInstancesByAgeStub.callsFake(async () => [instanceMock]);

            deleteManyInstancesByIdsStub.callsFake(async () => {});

            await cleanup.cleanup();

            assert.equal(getInstancesByAgeStub.callCount, 1);
            assert.ok(getInstancesByAgeStub.calledWith(1));
            assert.ok(deleteManyInstancesByIdsStub.calledWith(['1']));
        });

        // Tests that the cleanup function does not delete instances younger than the specified age.
        it('test_cleanup_does_not_delete_any_instances_when_there_are_none_to_delete', async () => {
            getInstancesByAgeStub.callsFake(async () => []);

            await cleanup.cleanup();

            assert.equal(getInstancesByAgeStub.callCount, 1);
            assert.ok(getInstancesByAgeStub.calledWith(1));
            assert.ok(deleteManyInstancesByIdsStub.notCalled);
        });

        // Tests that the cleanup function handles errors and exceptions correctly.
        it('test_cleanup_function_handles_errors_and_exceptions', async () => {
            const loggerErrorStub = sinon.stub(logger, 'error');
            getInstancesByAgeStub.throws(new Error('Test error'));
            await cleanup.cleanup();

            assert.ok(getInstancesByAgeStub.calledOnceWith(1));
            assert.ok(deleteManyInstancesByIdsStub.notCalled);
            assert.ok(
                loggerErrorStub.calledOnceWith(
                    'something went wrong during cleanup.'
                )
            );
        });
    });
});
