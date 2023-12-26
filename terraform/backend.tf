# used in main.tf as the Terraform backend
# https://developer.hashicorp.com/terraform/language/settings/backends/gcs

resource "google_storage_bucket" "backend" {
  name     = "columbia-sps-tech-mgmt-terraform"
  location = local.region

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  # only keep the most recent versions
  lifecycle_rule {
    condition {
      num_newer_versions = 30
    }
    action {
      type = "Delete"
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}
