variable "org_id" {}

variable "uni" {}

variable "email_override" {
  default     = null
  type        = string
  nullable    = true
  description = "Uses <UNI>@columbia.edu if not set"
}
