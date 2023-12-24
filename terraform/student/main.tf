resource "google_project" "project" {
  name       = "Ops Mgmt in IT - ${var.uni}"
  project_id = "columbia-ops-mgmt-${var.uni}"
  org_id     = var.org_id
}
