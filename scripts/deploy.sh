#!/bin/bash

# 빌드
npm run build

# S3 버킷 이름 설정
BUCKET_NAME="grosome"

# 빌드된 파일을 S3에 업로드
aws s3 sync out/ s3://$BUCKET_NAME/ \
  --delete \
  --exclude "*.git/*" \
  --exclude "*.DS_Store" \
  --cache-control "public, max-age=31536000, immutable"

# CloudFront 캐시 무효화 (CloudFront를 사용하는 경우)
# DISTRIBUTION_ID="your-distribution-id"
# aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" 