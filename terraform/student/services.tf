locals {
  has_billing_account = google_project.student.billing_account != null

  # some services require a billing account to be associated
  # https://support.google.com/googleapi/answer/6158867
  services_that_require_billing = [
    "compute.googleapis.com",
  ]
  services_to_enable = setunion([
    "analyticshub.googleapis.com",
    "bigquery.googleapis.com",
    "cloudaicompanion.googleapis.com",
    "sqladmin.googleapis.com",
  ], local.has_billing_account ? local.services_that_require_billing : [])
}

resource "google_project_service" "default" {
  project = google_project.student.project_id

  for_each                   = local.services_to_enable
  service                    = each.value
  disable_dependent_services = true
}
