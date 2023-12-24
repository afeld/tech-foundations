terraform {
  required_version = "~>1.0"

  # store the state remotely
  # https://developer.hashicorp.com/terraform/language/settings/backends/gcs
  # managed in bucket_backend.tf
  # backend "gcs" {
  #   bucket = "TODO"
  # }
}

provider "google" {
  project = "columbia-sps-tech-foundations"
  region  = "us-central1"
}

module "test_student" {
  source = "./student"

  uni = "teststudent"
}

moved {
  from = google_project.test_student
  to   = module.test_student.google_project.project
}
