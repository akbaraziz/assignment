#########
# Security group configuration

resource "aws_security_group" "ec2-bastion" {

  description   = "SG for Bastion Host"
  name          = local.sg_name
  vpc_id        = module.vpc.vpc_id

  ingress {
    description = "SSH Access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow outbound access"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = local.sg_name
  }
}

resource "aws_security_group" "mongodb" {
  description = "SG for MongoDB"
  name          = local.sg_name
  vpc_id        = module.vpc.vpc_id
  ingress {
    description = "MongoDB Inbound access"
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    description = "MongoDB Outbound access"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

## Add Bastion security Group to EKS cluster security Group
resource "aws_security_group_rule" "ec2_to_eks" {
  type                      = "ingress"
  from_port                 = 443
  to_port                   = 443
  protocol                  = "tcp"
  source_security_group_id  = aws_security_group.ec2-bastion.id
  security_group_id         = module.eks.cluster_security_group_id
  description               = "Add ec2-bastion security group to allow to connect to EKS cluster control plane" 
}

## Add Mongodb security Group to EKS cluster security Group
resource "aws_security_group_rule" "mongodb_to_eks" {
  type                      = "ingress"
  from_port                 = 443
  to_port                   = 443
  protocol                  = "tcp"
  source_security_group_id  = aws_security_group.mongodb.id
  security_group_id         = module.eks.cluster_security_group_id
  description               = "Add MongoDB security group to allow to connect to EKS cluster control plane" 
}