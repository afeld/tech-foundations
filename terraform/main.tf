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

data "google_project" "project" {}

module "test_student" {
  source = "./student"

  org_id         = data.google_project.project.org_id
  uni            = "teststudent"
  email_override = "aidan.feldman@gmail.com"
}
