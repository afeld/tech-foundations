locals {
  email = coalesce(var.email_override, "${var.uni}@columbia.edu")
}

resource "google_project_iam_member" "student" {
  project = google_project.student.project_id
  role    = "roles/editor"
  member  = "user:${local.email}"
}

resource "google_project_iam_member" "student_billing" {
  project = google_project.student.project_id
  role    = "roles/billing.projectManager"
  member  = "user:${local.email}"
}

# creator (person running Terraform) automatically added as an Owner

resource "google_project_iam_member" "associates" {
  for_each = toset([
    "as6950",
    "cv2464",
    "vv2358"
  ])

  project = google_project.student.project_id
  role    = "roles/owner"
  member  = "user:${each.key}@columbia.edu"
}
