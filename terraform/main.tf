terraform {
  required_version = "~>1.0"

  # store the state remotely
  # https://developer.hashicorp.com/terraform/language/settings/backends/gcs
  # managed in bucket_backend.tf
  # backend "gcs" {
  #   bucket = "TODO"
  # }
}

locals {
  project = "columbia-sps-tech-foundations"
}

provider "google" {
  project = local.project
  region  = "us-central1"

  # needed for
  # https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/billing_budget
  user_project_override = true
  billing_project       = local.project
}

data "google_project" "project" {}

module "test_student" {
  source = "./student"

  org_id         = data.google_project.project.org_id
  uni            = "teststudent"
  email_override = "aidan.feldman@gmail.com"
}
