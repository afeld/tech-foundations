# https://cloud.google.com/logging/docs/routing/overview#required-bucket
resource "google_logging_project_bucket_config" "required" {
  project        = google_project.student.project_id
  location       = "global"
  retention_days = 400
  bucket_id      = "_Required"

  depends_on = [google_project_service.default["logging.googleapis.com"]]
}

resource "google_logging_log_view" "not_instructor" {
  name        = "not-instructor"
  description = "View logs for actions not taken by the instructor"
  bucket      = google_logging_project_bucket_config.required.id
  filter      = "protoPayload.authenticationInfo.principalEmail!=\"alf2215@columbia.edu\""
}
