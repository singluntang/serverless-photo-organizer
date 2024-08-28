//Stage is either "dev" or "prod" **Case Sensitive**
export const stage = 'prod'

//------------------------------THIS PART IS FOR PRODUCTION---------------------------------

const apiId = 'pn36i6e4r0'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/${stage}`
export const authConfig = {
  domain: 'dev-m9dtj62g.us.auth0.com',
  clientId: '5P2qcZ21iggqeWk1px9x7IvBpk5T3mw5',
  callbackUrl: `http://localhost:3000/callback`
}

//------------------------------THIS PART IS FOR PRODUCTION---------------------------------


//------------------------------THIS PART IS FOR LOCAL OFFLINE------------------------------

// export const apiEndpoint = 'http://localhost:3000'

//------------------------------THIS PART IS FOR LOCAL OFFLINE------------------------------
