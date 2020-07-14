/**
 * This file is used to run unit tests for the adapter's
 * public interface
 **/

import { Container } from 'typedi'
import { SampleGateway } from '../gateway-template'
import { testAPI, APIResponse } from '../transport'

const fixtures = {
  simpleCharge: {
    // ...
  },
  simpleChargeBad: {
    // ...
  },
  paymentSchedule: {
    // ...
  },
  // etc.
}

describe('test sample gateway', () => {
  let gateway: SampleGateway

  beforeAll(() => {
    Container.set('sample.api', new testAPI())
  })

  beforeEach(() => {
    gateway = new SampleGateway()
  })

  afterAll(() => {
    Container.reset()
  })

  test('it has the right names', () => {
    expect(gateway.shortName).toBe('gateway template')
    expect(gateway.name).toBe('Gateway Template')
  })

  test('it can be charged', async () => {
    const fixture = fixtures.simpleCharge
    const response: APIResponse = await gateway.charge(fixture)
    expect(response?.status).toBe(200)
  })

  test('it reports errors if the charge format is not correct', async () => {
    const fixture = fixtures.simpleChargeBad

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: APIResponse = await gateway.charge(
      fixture
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })
})
