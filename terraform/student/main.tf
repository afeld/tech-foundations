resource "google_project" "student" {
  name       = "Ops Mgmt in IT - ${var.uni}"
  project_id = "columbia-ops-mgmt-${var.uni}"
  org_id     = var.org_id

  lifecycle {
    prevent_destroy = true
  }
}
