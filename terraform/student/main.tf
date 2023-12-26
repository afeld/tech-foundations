resource "google_project" "student" {
  name       = "Ops Mgmt in IT - ${var.uni}"
  project_id = "columbia-ops-mgmt-${var.uni}"
  org_id     = var.org_id
}

locals {
  email = coalesce(var.email_override, "${var.uni}@columbia.edu")
}

resource "google_project_iam_member" "student" {
  project = google_project.student.project_id
  role    = "roles/editor"
  member  = "user:${local.email}"
}

resource "google_project_iam_member" "associates" {
  for_each = toset([
    "as6950",
    "cv2464",
    "vv2358"
  ])

  project = google_project.student.project_id
  role    = "roles/editor"
  member  = "user:${each.key}@columbia.edu"
}
