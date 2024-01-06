resource "google_project" "student" {
  name       = "Ops Mgmt in IT - ${var.uni}"
  project_id = "columbia-ops-mgmt-${var.uni}"
  org_id     = var.org_id

  lifecycle {
    # we don't control the billing account, so ignore when set by the student
    ignore_changes  = [billing_account]
    prevent_destroy = true
  }
}
