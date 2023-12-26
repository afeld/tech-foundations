terraform {
  required_version = "~>1.0"

  # store the state remotely
  # https://developer.hashicorp.com/terraform/language/settings/backends/gcs
  # managed in backend.tf
  # backend "gcs" {
  #   bucket = "TODO"
  # }
}

locals {
  project = "columbia-sps-tech-foundations"
  region  = "us-central1"
}

provider "google" {
  project = local.project
  region  = local.region

  # needed for
  # https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/billing_budget
  user_project_override = true
  billing_project       = local.project
}

data "google_project" "project" {}

locals {
  students = csvdecode(file("${path.module}/students.csv"))
  unis     = toset([for student in local.students : student.UNI])
}

module "students" {
  source = "./student"

  for_each = local.unis

  org_id         = data.google_project.project.org_id
  uni            = each.key
  email_override = "aidan.feldman@gmail.com"
}

module "test_student" {
  source = "./student"

  org_id         = data.google_project.project.org_id
  uni            = "teststudent"
  email_override = "aidan.feldman@gmail.com"
}
