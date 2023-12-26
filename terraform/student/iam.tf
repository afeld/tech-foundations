locals {
  email = coalesce(var.email_override, "${var.uni}@columbia.edu")
}

resource "google_project_iam_member" "student" {
  project = google_project.student.project_id
  role    = "roles/editor"
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

# requires being a roles/iam.denyAdmin at the Organization level
resource "google_iam_deny_policy" "no_remove_instructors" {
  parent = urlencode("cloudresourcemanager.googleapis.com/projects/${google_project.student.project_id}")
  name   = "no-remove-instructors"

  rules {
    deny_rule {
      denied_principals    = ["principalSet://goog/public:all"]
      exception_principals = ["user:alf2215@columbia.edu"]
      # https://cloud.google.com/iam/docs/deny-permissions-support
      denied_permissions = [
        # "cloudresourcemanager.googleapis.com/projects.delete",
        # "cloudresourcemanager.googleapis.com/projects.move",
        # "cloudresourcemanager.googleapis.com/projects.setIamPolicy",

        # just for testing
        "cloudresourcemanager.googleapis.com/projects.getIamPolicy"
      ]
    }
  }

  depends_on = [
    google_project_iam_member.instructor_deny_admin,
    google_project_service.default["cloudresourcemanager.googleapis.com"],
    google_project_service.default["iam.googleapis.com"]
  ]
}
