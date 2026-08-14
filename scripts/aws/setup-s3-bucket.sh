#!/bin/bash
# ==============================================================================
# FitEmpire - AWS S3 Bucket Setup Script
# ==============================================================================
# Usage:
#   export AWS_ACCESS_KEY_ID="your_access_key"
#   export AWS_SECRET_ACCESS_KEY="your_secret_key"
#   export AWS_REGION="ap-south-1"   # Mumbai, India (Lowest Latency & Cost)
#   export BUCKET_NAME="fitempire-media-$(date +%s)"
#   bash setup-s3-bucket.sh
# ==============================================================================

set -e

BUCKET_NAME="${AWS_S3_BUCKET:-fitempire-media-prod}"
REGION="${AWS_REGION:-ap-south-1}"

echo "========================================================"
echo "Creating AWS S3 Bucket: $BUCKET_NAME in $REGION"
echo "========================================================"

# 1. Create Bucket
if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION"
else
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" \
        --create-bucket-configuration LocationConstraint="$REGION"
fi

# 2. Disable Block Public Access (for public image CDN access)
echo "Configuring Public Access..."
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# 3. Apply Bucket Policy for Public Read
echo "Applying Public Read Bucket Policy..."
cat <<EOF > /tmp/s3-policy.json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file:///tmp/s3-policy.json
rm -f /tmp/s3-policy.json

# 4. Set CORS Policy (For Web & Mobile browser uploads)
echo "Applying CORS Policy for Web & Mobile..."
cat <<EOF > /tmp/s3-cors.json
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3000
        }
    ]
}
EOF

aws s3api put-bucket-cors --bucket "$BUCKET_NAME" --cors-configuration file:///tmp/s3-cors.json
rm -f /tmp/s3-cors.json

echo "========================================================"
echo "✓ S3 Bucket Setup Complete!"
echo "Bucket Name: $BUCKET_NAME"
echo "Public URL:  https://$BUCKET_NAME.s3.$REGION.amazonaws.com"
echo "========================================================"
