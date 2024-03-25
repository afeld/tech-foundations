resource "google_project_service" "default" {
  for_each = toset([
    # needed to access in child Projects
    "appengine.googleapis.com",
    "cloudasset.googleapis.com",
    "cloudbuild.googleapis.com",

    "billingbudgets.googleapis.com",
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "compute.googleapis.com",
    "dns.googleapis.com",
    "firebase.googleapis.com",
    "serviceusage.googleapis.com"
  ])
  service = each.value
}
