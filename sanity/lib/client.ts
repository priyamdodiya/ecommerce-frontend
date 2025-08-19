import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId,writeToken } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: writeToken,
})
