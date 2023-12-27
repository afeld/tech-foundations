locals {
  email = coalesce(var.email_override, "${var.uni}@columbia.edu")
}

resource "google_project_iam_member" "student" {
  project = google_project.student.project_id
  role    = "roles/owner"
  member  = "user:${local.email}"
}

# creator (person running Terraform) automatically added as an Owner

resource "google_project_iam_member" "associates" {
  project = google_project.student.project_id
  role    = "roles/owner"
  member  = "group:opsmgmtinitinstructors@columbia.edu"
}
