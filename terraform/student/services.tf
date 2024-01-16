resource "google_project_service" "default" {
  project = google_project.student.project_id

  # some services require a billing account to be associated, so don't bother enabling them if we don't have one
  # https://support.google.com/googleapi/answer/6158867
  for_each = toset(google_project.student.billing_account == null ? [] : [
    "analyticshub.googleapis.com",
    "bigquery.googleapis.com",
    "cloudaicompanion.googleapis.com",
    "compute.googleapis.com",
    "sqladmin.googleapis.com",
  ])
  service = each.value
}
