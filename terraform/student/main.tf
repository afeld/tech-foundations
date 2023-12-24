data "google_project" "project" {}

resource "google_project" "project" {
  name       = "Ops Mgmt in IT - ${var.uni}"
  project_id = "columbia-ops-mgmt-${var.uni}"
  org_id     = data.google_project.project.org_id
}
