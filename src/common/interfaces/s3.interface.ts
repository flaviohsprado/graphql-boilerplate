interface IS3Credentials {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface IS3ClientUploadConfig {
  credentials: IS3Credentials;
  bucketName: string;
  ACL?: string;
  region?: string;
}
