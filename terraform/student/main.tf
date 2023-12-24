resource "google_project" "project" {
  name       = "Ops Mgmt in IT - ${var.uni}"
  project_id = "columbia-ops-mgmt-${var.uni}"
  org_id     = var.org_id
}

locals {
  email = coalesce(var.email_override, "${var.uni}@columbia.edu")
}

resource "google_project_iam_member" "student" {
  project = google_project.project.project_id
  role    = "roles/editor"
  member  = "user:${local.email}"
}
