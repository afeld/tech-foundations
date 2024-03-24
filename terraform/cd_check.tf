resource "google_firebase_project" "default" {
  provider = google-beta
  project  = local.root_project

  depends_on = [
    google_project_service.default["firebase.googleapis.com"]
  ]
}

resource "google_firestore_database" "database" {
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"

  depends_on = [
    google_firebase_project.default
  ]
}
