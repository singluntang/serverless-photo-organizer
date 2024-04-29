import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
const logger = createLogger('auth')

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJJQ7TksGj/VvOMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1tOWR0ajYyZy51cy5hdXRoMC5jb20wHhcNMjAxMjEzMTU0ODI2WhcN
MzQwODIyMTU0ODI2WjAkMSIwIAYDVQQDExlkZXYtbTlkdGo2MmcudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6zdkf3XpZzvzUsuV
A2Y74Rrhrlbc9u+aK0CBBnvOkziFCcWFngzIMRW4VqH6qY0qvdiU4mphtsB63WPr
leZLm3J/cyR+p8XZ6kvSuHmoHgJxesT1+3GqULzovTB0FEPcwgxb1fNr66fQ/deC
qHhyegu5tHeMiv4S4uKD3eWf46tdn2TuC1xz1YP8Sfs8E+Pl2MEv7t5J/aaBwl3y
txNV9xI3djLX3ayyGBUYVmQiF7H4TRld7Mf69DTMcpuI/QF0y/uuypHjH6cMZe49
6vJSEChIzcQci2wiEKSvhYs4DZaMOdH95bK7YNgF1KltOXUT0eOfTj2dvYJjP0gz
Auwz/wIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTrp1G3MUfP
ZZ5mfNsXuiZOLKJsezAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AENaiTLMWCE4XFY+eKLOjg9IAUw7WS6pCguoGhPPwE7jFEYWKrWFBDZmnispp00/
q0HfNYba/RJ7tuRZLckqg6Kgq/fydbsfRjPJeql6/1xbABkPdSsl1cGh60Zbb7zX
81xBPvx7Vcq4QvLfTzYW5iyTpjGf5fX4gurZcowKEqkJW7967NNTo5t6BS7srru0
r7AJOqfQ77p1KWlKcPeF6YiNpV8lbwyi+5qDoW2GzwKba2BDKVlMYCjkNPy6vu1p
fpLQV/6CIyxG02XWcBJ0+5Ix6m166kPUDXp9hdapEREOxUNkZ2EvWiMctJ+fPGks
qIgh2rsUqhC156qHzMpGHZE=
-----END CERTIFICATE-----`
                   

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    logger.info('User Authorized', {authorized: true})

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: JwtPayload = decode(token, { complete: true }) as JwtPayload

  logger.info('JWT', jwt)

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

