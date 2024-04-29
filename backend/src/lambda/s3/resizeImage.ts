import { S3Handler, S3Event } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { attachUrlToFeed, processImage } from '../../businessLogic/udagram'

const logger = createLogger('attachimageUrl')

const thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET
const region = process.env.BUCKET_REGION

export const handler: S3Handler = async (event: S3Event) => {
  
  logger.info('Event Processing', event)

  // for (const s3Record of event.Records) {

    // const s3EventStr = snsRecord.Sns.Message

    // logger.info('Processing S3 record', {record: s3Record})

    // const s3Event = JSON.parse(s3Record)

    await processEvent(event)    
  // }
 }

 async function processEvent(s3Event: S3Event) {
  for (const record of s3Event.Records) {
    let key = record.s3.object.key

    logger.info('Image Key', {key})

    await processImage(key)

    const imageUrl: string = `https://${thumbnailBucketName}.s3.${region}.amazonaws.com/${key}.jpeg`

    logger.info('imageUrl', {imageUrl})    

    await attachUrlToFeed(imageUrl, key) 
       
  }
}
