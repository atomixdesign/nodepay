export class BPOINTConfig{
  [key: string]: string | undefined
  username: string
  merchantId?: string
  password: string
  apiRoot: string

  constructor(
    username: string,
    password: string,
    apiRoot: string,
    merchantId?: string,
  ) {
    this.username = username
    this.merchantId = merchantId
    this.password = password
    this.apiRoot = apiRoot
  }
}
