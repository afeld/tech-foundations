variable "org_id" {
  type = string
}

variable "uni" {
  type = string
}

variable "email_override" {
  default     = null
  type        = string
  nullable    = true
  description = "Uses <UNI>@columbia.edu if not set"
}
