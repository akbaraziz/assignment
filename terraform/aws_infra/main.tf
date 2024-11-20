# Kubernetes provider
provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
}

provider "aws" {
  region = var.region
}

data "aws_availability_zones" "available" {}

# Retrieve S3 Bucket
data "aws_s3_bucket" "s3-tfstate" {
  bucket = local.s3_name
}

# Ubuntu ami
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] # Canonical
}

# Generate Random 3 chars
resource "random_string" "suffix" {
  length  = 3
  special = false
  upper   = false
}

# Define local var that will be use by TF
locals {
  cluster_name      = "${var.name_prefix}-eks-${random_string.suffix.result}"
  vpc_name          = "${var.name_prefix}-vpc-${random_string.suffix.result}"
  s3_name           = "${var.name_prefix}-s3-tfstate"
  ec2_bastion_name  = "${var.name_prefix}-ec2-bastion-${random_string.suffix.result}"
  sshkey_name       = "${var.name_prefix}-sshkey-${random_string.suffix.result}"
  sg_name           = "${var.name_prefix}-sg-${random_string.suffix.result}"
  ecr_name          = "${var.name_prefix}-ecr-${random_string.suffix.result}"
  mongodb_name      = "${var.name_prefix}-mongodb-${random_string.suffix.result}"
}

# AWS ECR Repository
resource "aws_ecr_repository" "app" {
  name = local.ecr_name
}

# EC2 Bastion Instance
resource "aws_instance" "ec2instance-bastion" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro" # Example instance type
  key_name      = local.sshkey_name

  tags = {
    Name = local.ec2_bastion_name
  }
}

# MongoDB EC2 Instance
resource "aws_instance" "ec2instance-mongodb" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.small" # Example instance type
  key_name      = local.sshkey_name

  tags = {
    Name = local.mongodb_name
  }
}
