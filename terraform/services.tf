resource "google_project_service" "default" {
  for_each = toset([
    # needed to access App Engine in child Projects
    "appengine.googleapis.com",

    "billingbudgets.googleapis.com",
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "compute.googleapis.com",
    "dns.googleapis.com",
    "serviceusage.googleapis.com"
  ])
  service = each.value
}
