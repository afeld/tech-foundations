terraform {
  required_version = "~>1.0"

  # store the state remotely
  # https://developer.hashicorp.com/terraform/language/settings/backends/gcs
  # managed in backend.tf
  backend "gcs" {
    bucket = "columbia-sps-tech-mgmt-terraform"
  }
}

locals {
  root_project = "columbia-sps-tech-foundations"
  region       = "us-central1"
}

provider "google" {
  project = local.root_project
  region  = local.region

  # needed for
  # https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/billing_budget
  user_project_override = true
  billing_project       = local.root_project
}

data "google_project" "root_project" {}
