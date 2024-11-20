output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group ids attached to the cluster control plane"
  value       = module.eks.cluster_security_group_id
}

output "region" {
  description = "AWS region"
  value       = var.region
}

output "cluster_name" {
  description = "Kubernetes Cluster Name"
  value       = module.eks.cluster_name
}

output "ec2instance_ip" {
  value = aws_instance.ec2instance.public_ip
}

output "ec2instance_dns" {
  value = aws_instance.ec2instance.public_dns
}

output "ecr_registry_url" {
  value = aws_ecr_repository.ecr.repository_url
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.app.repository_url
}

output "load_balancer_role_arn" {
  description = "ARN of the IAM role for ALB Ingress Controller"
  value       = module.lb_role.iam_role_arn
}

output "ecr_repository_name" {
  description = "Name of the ECR repository"
  value       = aws_ecr_repository.app.repository_name
}

output "mongodb_host" {
  description = "MongoDB host"
  value       = module.mongodb.mongodb_host
}