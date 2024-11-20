provider "aws" {
  region = var.region
}

data "aws_availability_zones" "available" {}

locals {
  s3_name     = "akbar-terraform-state"
}




