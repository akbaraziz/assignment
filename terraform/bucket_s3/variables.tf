variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "name_prefix" {
  description = "Objects name prefix to use for deployment"
  type        = string
  default     = "eks"
}

variable "actor" {
  description = "GitHub actor who triggered the creation"
  type        = string
  default     = "actor"
}