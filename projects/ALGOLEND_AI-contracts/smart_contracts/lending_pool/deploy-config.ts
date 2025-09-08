import * as algokit from '@algorandfoundation/algokit-utils'
import { LendingPoolClient } from '../artifacts/lending_pool/LendingPoolClient'

// This file contains the deployment configuration for our contract

const defaultParams: algokit.DeployAppParams = {
  onSchemaBreak: 'replace',
  onUpdate: 'update',
}

export async function deploy() {
  console.log('=== Deploying Lending Pool Contract ===')

  const algod = algokit.getAlgoClient()
  const indexer = algokit.getAlgoIndexerClient()
  const deployer = await algokit.getAccount(
    {
      config: algokit.getAccountConfigFromEnvironment('DEPLOYER'),
      fundWith: algokit.algos(10),
    },
    algod
  )

  const appClient = new LendingPoolClient(
    {
      resolveBy: 'creatorAndName',
      creator: deployer.addr,
      name: 'LendingPool',
      findExistingUsing: indexer,
    },
    algod
  )

  const app = await appClient.deploy({
    ...defaultParams,
    createArgs: {
      owner: deployer.addr,
      initialRate: 500, // 5% annual interest rate
    },
    createOnCompleteAction: 'create',
  })

  // Demonstrate the app is working
  const globalState = await appClient.getGlobalState()
  console.log('Lending Pool deployed successfully!')
  console.log(`App ID: ${app.appId}`)
  console.log(`App Address: ${app.appAddress}`)
  console.log(`Pool Owner: ${globalState.poolOwner?.asString()}`)
  console.log(`Interest Rate: ${globalState.interestRate?.asNumber()}bp`)

  return { appClient, appId: app.appId, appAddress: app.appAddress }
}
