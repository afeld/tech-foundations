resource "google_project_service" "default" {
  project = google_project.student.project_id

  for_each = toset([
    "analyticshub.googleapis.com",
    "bigquery.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com"
  ])
  service = each.value
}
