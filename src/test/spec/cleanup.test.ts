/* eslint-disable import/extensions */
import {
    Config,
    Logger,
    ProcessEnvConfig,
    StandardLogger,
} from '@ubio/framework';
import assert from 'assert';
import { Mesh } from 'mesh-ioc';
import { restore, stub } from 'sinon';

import { InstanceRepository } from '../../main/repositories/inctance.js';
import { Scheduler } from '../../main/scheduler/scheduler.js';
import { Cleanup } from '../../main/service/cleanup.js';
import { MockInstanceRepository } from '../mocks/repositories/instance.js';

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
        mesh.service(InstanceRepository, MockInstanceRepository);
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
        getInstancesByAgeStub = stub(instanceRepository, 'getInstancesByAge');
        deleteManyInstancesByIdsStub = stub(
            instanceRepository,
            'deleteManyInstancesByIds'
        );
    });

    afterEach(() => {
        restore();
    });

    describe('Cleanup Service', () => {
        it('should delete old instances based on age parameter', async () => {
            getInstancesByAgeStub.callsFake(async () => [instanceMock]);

            deleteManyInstancesByIdsStub.callsFake(async () => {});

            await cleanup.cleanup();

            assert.equal(getInstancesByAgeStub.callCount, 1);
            assert.ok(getInstancesByAgeStub.calledWith(1));
            assert.ok(deleteManyInstancesByIdsStub.calledWith(['1']));
        });

        it('should not delete instances when no old ones are found', async () => {
            getInstancesByAgeStub.callsFake(async () => []);

            await cleanup.cleanup();

            assert.equal(getInstancesByAgeStub.callCount, 1);
            assert.ok(getInstancesByAgeStub.calledWith(1));
            assert.ok(deleteManyInstancesByIdsStub.notCalled);
        });

        it('should handle erros/exceptions', async () => {
            const loggerErrorStub = stub(logger, 'error');
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
