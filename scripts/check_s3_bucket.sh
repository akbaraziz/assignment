#!/bin/bash

region=$3

# Check if the Terraform State bucket exists
first_bucket_name="akbar-terraform-state"
if aws s3api head-bucket --bucket $first_bucket_name 2>/dev/null; then
    echo "The bucket '$first_bucket_name' exists."
    echo "No need to create it, it will be used to store infrastructure tfstate which will be created later"
else
    echo "The bucket '$first_bucket_name' does not exist."
    echo "'$first_bucket_name' Bucket S3 creation in progress..."
    terraform -chdir="../terraform/bucket_s3" init
    terraform -chdir="../terraform/bucket_s3" apply -var="name_prefix=$1" -var="actor=$2" -var="region=$3" -auto-approve
fi

# Check if the MongoDB bucket exists
second_bucket_name="mongodb-backup-akbar"
if aws s3api head-bucket --bucket $second_bucket_name 2>/dev/null; then
    echo "The bucket '$second_bucket_name' exists."
    echo "No need to create it, it will be used for MongoDB backups."
else
    echo "The bucket '$second_bucket_name' does not exist."
    echo "'$second_bucket_name' Bucket S3 creation in progress..."
    terraform -chdir="../terraform/bucket_s3" init
    terraform -chdir="../terraform/bucket_s3" apply -var="name_prefix=$1" -var="actor=$2" -var="region=$3" -auto-approve
fi