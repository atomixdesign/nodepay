import { TestGateway } from './gateways'
import { Nodepay } from './nodepay'

const nodepay = new Nodepay([
  new TestGateway(),
])

console.log(nodepay.gateways)
